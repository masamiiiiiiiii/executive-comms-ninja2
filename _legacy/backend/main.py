
import os
import time
import json
import asyncio
from typing import Optional, Dict, Any
from google.cloud import videointelligence
from google.cloud import storage
from supabase import create_client, Client
import yt_dlp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GCP_BUCKET_NAME = os.getenv("GCP_BUCKET_NAME")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if not all([SUPABASE_URL, SUPABASE_KEY, GCP_BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS]):
    print("Error: Missing environment variables. Please check .env file.")
    exit(1)

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
storage_client = storage.Client()
video_client = videointelligence.VideoIntelligenceServiceClient()

def download_youtube_video(url: str, output_path: str) -> Optional[str]:
    """Downloads YouTube video to local path."""
    print(f"Downloading {url}...")
    ydl_opts = {
        'format': 'best[ext=mp4]',
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return output_path
    except Exception as e:
        print(f"Error downloading video: {e}")
        return None

def upload_to_gcs(source_file_name: str, destination_blob_name: str) -> str:
    """Uploads a file to the bucket."""
    print(f"Uploading to GCS: {destination_blob_name}...")
    bucket = storage_client.bucket(GCP_BUCKET_NAME)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    return f"gs://{GCP_BUCKET_NAME}/{destination_blob_name}"

def analyze_video_gcp(gcs_uri: str) -> Dict[str, Any]:
    """Calls Google Cloud Video Intelligence API."""
    print("Starting Video Intelligence Analysis...")
    
    features = [
        videointelligence.Feature.FACE_DETECTION,
        videointelligence.Feature.PERSON_DETECTION,
        videointelligence.Feature.SPEECH_TRANSCRIPTION
    ]
    
    transcript_config = videointelligence.SpeechTranscriptionConfig(
        language_code="en-US",
        enable_automatic_punctuation=True
    )

    video_context = videointelligence.VideoContext(
        speech_transcription_config=transcript_config
    )

    operation = video_client.annotate_video(
        request={
            "features": features,
            "input_uri": gcs_uri,
            "video_context": video_context
        }
    )

    print("Processing video... (this may take a few minutes)")
    result = operation.result(timeout=600)
    
    # Process results (simplified for brevity)
    # in a real app, you would parse annotations into your specific JSON structure
    return process_gcp_results(result)

def process_gcp_results(result) -> Dict[str, Any]:
    """Converts GCP result to our app's JSON format."""
    # Mocking the conversion logic for now, utilizing the real data structure where possible
    # Real implementation would iterate through result.annotation_results
    
    # Analyze confidence based on face detection confidence
    avg_confidence = 0
    face_count = 0
    
    for annotation_result in result.annotation_results:
        for face_detection in annotation_result.face_detection_annotations:
            for track in face_detection.tracks:
                if track.confidence:
                    avg_confidence += track.confidence
                    face_count += 1
    
    final_confidence = int((avg_confidence / face_count * 100) if face_count > 0 else 75)
    
    return {
        "overallScore": 85, # Placeholder algorithm
        "metrics": {
            "confidence": final_confidence,
            "trustworthiness": 80,
            "engagement": 75,
            "clarity": 88 
        },
        "emotionAnalysis": {
            "confidence": final_confidence,
            "enthusiasm": 70,
            "calmness": 85,
            "authenticity": 80,
            "authority": 82,
            "empathy": 75
        },
        "timeline": [
            {"time": "00:10", "event": "Analysis Started", "impact": "neutral"},
            {"time": "00:45", "event": "Strong Eye Contact Detected", "impact": "positive"}
        ],
        "recommendations": [
            {
                "category": "Visual",
                "what": "Improve lighting",
                "why": "Face detection confidence was variable",
                "how": "Use front-facing soft light",
                "priority": "medium"
            }
        ],
        "voiceAnalysis": {
            "pace": "Optimal",
            "tone": "Professional",
            "clarity": "High"
        },
        "messageAnalysis": {
            "keyMessages": ["Detected GCP Analysis"],
            "structure": "Logical",
            "persuasiveness": "High"
        }
    }

def process_job(job: Dict[str, Any]):
    """Orchestrates the workflow for a single job."""
    print(f"Processing Job ID: {job['id']}")
    
    try:
        # 1. Update status to processing
        supabase.table("video_analyses").update({"status": "processing"}).eq("id", job['id']).execute()
        
        # 2. Download
        video_filename = f"temp_{job['id']}.mp4"
        download_path = download_youtube_video(job['youtube_url'], video_filename)
        
        if not download_path:
             raise Exception("Download failed")

        # 3. Upload
        gcs_uri = upload_to_gcs(download_path, f"videos/{job['id']}.mp4")
        
        # 4. Analyze
        results = analyze_video_gcp(gcs_uri)
        
        # 5. Save Results
        supabase.table("video_analyses").update({
            "status": "completed",
            "analysis_results": results
        }).eq("id", job['id']).execute()
        
        print(f"Job {job['id']} completed successfully.")

        # Cleanup
        if os.path.exists(download_path):
            os.remove(download_path)
            
    except Exception as e:
        print(f"Job failed: {e}")
        supabase.table("video_analyses").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", job['id']).execute()

def main_loop():
    print("Worker started. Polling for jobs...")
    while True:
        try:
            # Fetch pending jobs
            # Note: Assuming 'status' column exists. If not, we might need to rely on 'analysis_results' being null
            # Checking if status column exists is a prerequisite, otherwise we fallback to analysis_results.is.null
            response = supabase.table("video_analyses").select("*").eq("status", "pending").execute()
            
            jobs = response.data
            
            if jobs:
                print(f"Found {len(jobs)} pending jobs.")
                for job in jobs:
                    process_job(job)
            
            time.sleep(5) # Poll every 5 seconds
            
        except Exception as e:
            print(f"Polling loop error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main_loop()

