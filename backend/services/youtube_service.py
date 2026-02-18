import yt_dlp
import os
from google.cloud import storage
import uuid

# Ensure temp directory exists
os.makedirs("temp", exist_ok=True)

class YouTubeService:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.storage_client = None
        self.bucket = None
        # Only init GCS if bucket_name is provided (and auth is available)
        if bucket_name:
            try:
                self.storage_client = storage.Client()
                self.bucket = self.storage_client.bucket(bucket_name)
            except Exception as e:
                print(f"Warning: GCS init failed (likely no auth): {e}")

    def download_video_local(self, youtube_url: str) -> str:
        """
        Downloads a YouTube video to a local temp file.
        Returns the local file path.
        """
        video_id = str(uuid.uuid4())
        # Use simple filenames to avoid weird characters
        output_template = f"temp/{video_id}.%(ext)s"
        
        ydl_opts = {
            'format': 'best[ext=mp4]/best', # Prefer mp4 for compatibility
            'outtmpl': output_template,
            'quiet': False,
            'no_warnings': False,
            'nocheckcertificate': True,
            'extractor_args': {'youtube': {'player_client': ['android']}},
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"Downloading {youtube_url} locally...")
                info = ydl.extract_info(youtube_url, download=True)
                # handle filename potentially changing (e.g. merging video+audio)
                filename = ydl.prepare_filename(info)
                
                # Extract metadata
                metadata = {
                    "title": info.get("title", "Unknown Title"),
                    "author": info.get("uploader", "Unknown Channel"),
                    "publish_date": info.get("upload_date", "Unknown Date"),
                    "length": info.get("duration", 0),
                    "channel_url": info.get("channel_url", "")
                }
                
                # Verify file exists
                if not os.path.exists(filename):
                     # Try to find it if extension differs
                     base, _ = os.path.splitext(filename)
                     for ext in ['mp4', 'mkv', 'webm']:
                        if os.path.exists(f"{base}.{ext}"):
                            return f"{base}.{ext}", metadata
                     raise Exception("Downloaded file not found")
                
                return filename, metadata

        except Exception as e:
            print(f"Error downloading video locally: {e}")
            raise e
