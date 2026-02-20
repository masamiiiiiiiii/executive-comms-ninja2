import yt_dlp
import os
import re
from google.cloud import storage
import uuid

# Ensure temp directory exists
os.makedirs("temp", exist_ok=True)

class YouTubeService:
    def __init__(self, bucket_name: str = None):
        self.bucket_name = bucket_name
        self.storage_client = None
        self.bucket = None
        if bucket_name:
            try:
                self.storage_client = storage.Client()
                self.bucket = self.storage_client.bucket(bucket_name)
            except Exception as e:
                print(f"Warning: GCS init failed: {e}")

    def get_transcript(self, youtube_url: str) -> str:
        """ Fetches transcript using pytubefix to bypass YouTube bot blocks """
        from pytubefix import YouTube
        
        try:
            # We must use 'TV' client because 'ANDROID' and 'WEB' now require PO Tokens for captions
            # which blocks automated scraping on Cloud Run
            yt = YouTube(youtube_url, client='TV')
            captions = yt.captions
            
            if not captions:
                # Fallback to WEB just in case TV fails to return captions for some videos
                try:
                    yt = YouTube(youtube_url, client='WEB')
                    captions = yt.captions
                except:
                    pass
            
            if not captions:
                raise ValueError("No captions available for this video.")
                
            # Try to find English or Japanese, or fallback to auto-generated
            c = None
            for lang_code in ['en', 'ja', 'a.en', 'a.ja']:
                if lang_code in captions:
                    c = captions[lang_code]
                    break
                    
            if not c:
                # Fallback to whatever is available
                c = list(captions.values())[0]
                
            srt_content = c.generate_srt_captions()
            
            # Clean up the SRT content by removing timestamps and indexes
            # SRT format is:
            # 1
            # 00:00:00,000 --> 00:00:02,000
            # text text text
            # (blank line)
            
            cleaned_lines = []
            for line in srt_content.split('\n'):
                line = line.strip()
                if not line:
                    continue
                if line.isdigit():
                    continue
                if '-->' in line:
                    continue
                cleaned_lines.append(line)
                
            text = " ".join(cleaned_lines)
            return text
            
        except Exception as e:
            raise ValueError(f"Could not retrieve transcripts for this video: {e}")

    def get_metadata(self, youtube_url: str) -> dict:
        """ Fast metadata extraction without downloading the video """
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'extract_flat': True,
        }
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                return {
                    "title": info.get("title", "Unknown Title"),
                    "author": info.get("uploader", "Unknown Channel"),
                    "publish_date": info.get("upload_date", "Unknown Date"),
                    "length": info.get("duration", 0),
                    "channel_url": info.get("channel_url", "")
                }
        except Exception as e:
            print(f"Metadata extraction failed, returning default: {e}")
            return {}
