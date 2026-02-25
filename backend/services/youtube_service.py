import yt_dlp
import os
import re
import http.cookiejar
import requests as req_lib

class YouTubeService:
    def __init__(self, bucket_name: str = None):
        self.bucket_name = bucket_name

    def _extract_video_id(self, url: str) -> str:
        m = re.search(r'(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})', url)
        if not m:
            raise ValueError(f"Could not extract video ID from URL: {url}")
        return m.group(1)

    def _get_cookie_path(self) -> str:
        base_dir = "/app" if os.path.isdir("/app") else os.path.dirname(os.path.abspath(__file__))
        paths_to_try = [
            os.path.join(base_dir, "cookies.txt"),
            os.path.join(base_dir, "..", "cookies.txt"),
            "cookies.txt",
        ]
        for p in paths_to_try:
            if os.path.exists(p):
                return os.path.abspath(p)
        return None

    def get_transcript(self, youtube_url: str) -> str:
        """
        Primary: youtube-transcript-api with cookies (handles auto-generated + manual captions).
        Fallback: yt-dlp with cookies.
        """
        vid = self._extract_video_id(youtube_url)
        print(f"Fetching transcript for video: {vid}")

        cookie_path = self._get_cookie_path()
        print(f"Cookie path: {cookie_path}, exists: {bool(cookie_path)}")

        # Strategy 1: youtube-transcript-api
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            
            if cookie_path:
                # Load cookies and inject into requests session
                cj = http.cookiejar.MozillaCookieJar(cookie_path)
                cj.load(ignore_discard=True, ignore_expires=True)
                session = req_lib.Session()
                session.cookies = cj
                session.headers.update({
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                })
                
                from youtube_transcript_api._transcripts import TranscriptListFetcher
                fetcher = TranscriptListFetcher(session)
                transcript_list = fetcher.fetch(vid)
            else:
                api = YouTubeTranscriptApi()
                transcript_list = api.list(vid)

            # Try English first, then any available
            transcript = None
            for lang in ['en', 'en-US', 'ja']:
                try:
                    transcript = transcript_list.find_transcript([lang])
                    break
                except:
                    pass
            if not transcript:
                try:
                    transcript = transcript_list.find_generated_transcript(['en', 'ja'])
                except:
                    pass

            if not transcript:
                raise ValueError("No English or Japanese transcript found for this video.")

            fetched = transcript.fetch()
            text = " ".join(snip.text for snip in fetched.snippets)
            text = re.sub(r'<[^>]+>', '', text)
            text = text.replace('&nbsp;', ' ').replace('&#39;', "'").replace('&amp;', '&')
            text = re.sub(r'\s+', ' ', text).strip()
            print(f"youtube-transcript-api SUCCESS: {len(text)} chars")
            return text

        except Exception as e:
            print(f"youtube-transcript-api failed: {e}")

        # Strategy 2: yt-dlp with cookies
        print("Falling back to yt-dlp with cookies...")
        import yt_dlp as ytdlp_mod, uuid, glob

        base_dir = "/app" if os.path.isdir("/app") else os.path.dirname(os.path.abspath(__file__))
        req_id = str(uuid.uuid4())
        out_path = os.path.join(base_dir, "temp", req_id)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)

        ydl_opts = {
            'quiet': False,
            'skip_download': True,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en', 'ja'],
            'outtmpl': out_path,
        }
        if cookie_path:
            ydl_opts['cookiefile'] = cookie_path

        try:
            with ytdlp_mod.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])

            vtt_files = glob.glob(f"{out_path}*.vtt")
            if not vtt_files:
                raise ValueError("No captions found via yt-dlp.")

            selected = vtt_files[0]
            for f in vtt_files:
                if '.en.' in f:
                    selected = f
                    break

            with open(selected, 'r', encoding='utf-8') as f:
                vtt_content = f.read()

            for f in vtt_files:
                try: os.remove(f)
                except: pass

            return self._parse_vtt(vtt_content)

        except Exception as e:
            raise ValueError(f"Could not retrieve transcripts for this video: {e}")

    def _parse_vtt(self, vtt: str) -> str:
        lines = []
        for line in vtt.split('\n'):
            line = line.strip()
            if not line or line == "WEBVTT" or '-->' in line:
                continue
            if any(line.startswith(p) for p in ('Kind:', 'Language:', 'NOTE')):
                continue
            line = re.sub(r'<[^>]+>', '', line)
            line = line.replace('&nbsp;', ' ').replace('&#39;', "'").replace('&amp;', '&')
            if line and (not lines or line != lines[-1]):
                lines.append(line)
        return ' '.join(lines)

    def download_audio(self, youtube_url: str) -> str:
        """
        Download only audio from YouTube using yt-dlp.
        Returns the path to the downloaded audio file.
        """
        import uuid
        import os
        import yt_dlp as ytdlp_mod

        base_dir = "/app" if os.path.isdir("/app") else os.path.dirname(os.path.abspath(__file__))
        req_id = str(uuid.uuid4())
        out_dir = os.path.join(base_dir, "temp", req_id)
        os.makedirs(out_dir, exist_ok=True)
        
        out_path = os.path.join(out_dir, "audio.%(ext)s")
        
        cookie_path = self._get_cookie_path()
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '128',
            }],
            'outtmpl': out_path,
            'quiet': False,
        }
        
        if cookie_path:
            ydl_opts['cookiefile'] = cookie_path
            
        try:
            print(f"Attempting audio download with yt-dlp: {youtube_url}")
            with ytdlp_mod.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])
            
            # Find the actual downloaded file (extension might be changed by postprocessor)
            import glob
            downloaded_files = glob.glob(os.path.join(out_dir, "audio.mp3"))
            if not downloaded_files:
                # Try any file in that directory
                downloaded_files = glob.glob(os.path.join(out_dir, "*"))
            
            if not downloaded_files:
                raise ValueError("Audio download failed: No file found.")
                
            return downloaded_files[0]
            
        except Exception as e:
            print(f"yt-dlp audio download failed: {e}. Trying pytubefix fallback...")
            
            try:
                from pytubefix import YouTube
                yt = YouTube(youtube_url)
                # Filter for audio-only streams
                audio_stream = yt.streams.get_audio_only()
                if not audio_stream:
                    raise ValueError("No audio stream found via pytubefix.")
                
                # Download and rename with a valid extension so mimetypes can detect it
                download_path = audio_stream.download(output_path=out_dir, filename="audio_raw.mp4")
                
                # Convert to mp3 using moviepy (since it's in requirements) or just use as is if Gemini supports it
                # Gemini supports various audio formats including mp4/m4a which pytube downloads
                print(f"pytubefix download success: {download_path}")
                return download_path
                
            except Exception as e2:
                print(f"pytubefix audio download failed: {e2}")
                raise ValueError(f"Could not download audio via any method. Last error: {e2}")

    def download_video(self, youtube_url: str) -> str:
        """
        Download standard resolution video (up to 720p to save time/bandwidth) using yt-dlp.
        Returns the path to the downloaded video file.
        """
        import uuid
        import os
        import yt_dlp as ytdlp_mod

        base_dir = "/app" if os.path.isdir("/app") else os.path.dirname(os.path.abspath(__file__))
        req_id = str(uuid.uuid4())
        out_dir = os.path.join(base_dir, "temp", req_id)
        os.makedirs(out_dir, exist_ok=True)
        
        out_path = os.path.join(out_dir, "video.%(ext)s")
        cookie_path = self._get_cookie_path()
        
        ydl_opts = {
            'format': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
            'outtmpl': out_path,
            'quiet': False,
            'merge_output_format': 'mp4',
        }
        
        if cookie_path:
            ydl_opts['cookiefile'] = cookie_path
            
        try:
            print(f"Attempting video download with yt-dlp: {youtube_url}")
            with ytdlp_mod.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])
            
            import glob
            downloaded_files = glob.glob(os.path.join(out_dir, "video.mp4"))
            if not downloaded_files:
                downloaded_files = glob.glob(os.path.join(out_dir, "video.*"))
                if not downloaded_files:
                    downloaded_files = glob.glob(os.path.join(out_dir, "*"))
            
            if not downloaded_files:
                raise ValueError("Video download failed: No file found.")
                
            return downloaded_files[0]
            
        except Exception as e:
            print(f"yt-dlp video download failed: {e}. Trying pytubefix fallback...")
            
            try:
                from pytubefix import YouTube
                yt = YouTube(youtube_url)
                video_stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
                if not video_stream:
                    # Fallback to mostly any mp4
                    video_stream = yt.streams.filter(file_extension='mp4').first()
                    
                if not video_stream:
                    raise ValueError("No viable video stream found via pytubefix.")
                
                download_path = video_stream.download(output_path=out_dir, filename="video_raw.mp4")
                print(f"pytubefix video download success: {download_path}")
                return download_path
                
            except Exception as e2:
                print(f"pytubefix video download failed: {e2}")
                raise ValueError(f"Could not download video via any method. Last error: {e2}")

    def get_metadata(self, youtube_url: str) -> dict:
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
                    "channel_url": info.get("channel_url", ""),
                    "description": info.get("description", "")
                }
        except Exception as e:
            print(f"Metadata extraction failed: {e}")
            return {}
