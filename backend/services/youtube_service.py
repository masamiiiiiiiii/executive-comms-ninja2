import yt_dlp
import os
from google.cloud import storage
import uuid

# Ensure temp directory exists
os.makedirs("temp", exist_ok=True)

class YouTubeService:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)

    def download_and_upload(self, youtube_url: str) -> str:
        """
        Downloads a YouTube video and uploads it to GCS.
        Returns the GCS URI (gs://...).
        """
        video_id = str(uuid.uuid4())
        output_template = f"temp/{video_id}.%(ext)s"
        
        ydl_opts = {
            'format': 'best',
            'outtmpl': output_template,
            'quiet': False,
            'no_warnings': False,
            'nocheckcertificate': True,
            'extractor_args': {'youtube': {'player_client': ['android']}},
        }

        downloaded_file_path = None

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"Downloading {youtube_url}...")
                info = ydl.extract_info(youtube_url, download=True)
                downloaded_file_path = ydl.prepare_filename(info)
                
                # Handle cases where extension might differ
                if not os.path.exists(downloaded_file_path):
                    # Try to find the file if extension changed
                    base_name = os.path.splitext(downloaded_file_path)[0]
                    for ext in ['mp4', 'mkv', 'webm']:
                        if os.path.exists(f"{base_name}.{ext}"):
                            downloaded_file_path = f"{base_name}.{ext}"
                            break

            if not downloaded_file_path or not os.path.exists(downloaded_file_path):
                raise Exception("Failed to download video file")

            # Upload to GCS
            blob_name = f"videos/{video_id}/{os.path.basename(downloaded_file_path)}"
            blob = self.bucket.blob(blob_name)
            
            print(f"Uploading to gs://{self.bucket_name}/{blob_name}...")
            blob.upload_from_filename(downloaded_file_path)
            
            return f"gs://{self.bucket_name}/{blob_name}"

        except Exception as e:
            print(f"Error in download_and_upload: {e}")
            raise e
        finally:
            # Cleanup
            if downloaded_file_path and os.path.exists(downloaded_file_path):
                os.remove(downloaded_file_path)
