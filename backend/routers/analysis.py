from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from services.youtube_service import YouTubeService
from services.gemini_service import GeminiService
from supabase import create_client, Client
import os
import uuid

router = APIRouter()

# Initialize services
# Note: In production, use dependency injection
def get_services():
    bucket_name = os.getenv("GCP_BUCKET_NAME")
    project_id = os.getenv("GCP_PROJECT_ID") # We need to add this to .env
    
    # Debugging: Print CWD and env vars
    print(f"Current Working Directory: {os.getcwd()}")
    
    # Fallback to extracting project_id from service account if not in env
    if not project_id:
        try:
            # Try absolute path first if relative fails, or check common locations
            sa_path = "service_account.json"
            if not os.path.exists(sa_path):
                 print(f"File not found: {sa_path}")
            
            with open(sa_path, "r") as f:
                import json
                sa = json.load(f)
                project_id = sa.get("project_id")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Could not load project_id from service_account.json: {e}")

    if not project_id:
        print("ERROR: Project ID is missing.")
        raise HTTPException(status_code=500, detail="Configuration Error: Project ID missing")

    try:
        youtube_service = YouTubeService(bucket_name)
        gemini_service = GeminiService(project_id)
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
             print("ERROR: Supabase credentials missing from environment.")
             raise ValueError("Supabase credentials missing")

        supabase: Client = create_client(supabase_url, supabase_key)
        
        return youtube_service, gemini_service, supabase
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error initializing services: {e}")
        raise HTTPException(status_code=500, detail=f"Service Initialization Error: {e}")

class AnalysisRequest(BaseModel):
    youtube_url: str
    user_id: str
    video_title: str
    company: str
    role: str
    target_person: str
    transcript_text: str = ""

async def process_analysis(request: AnalysisRequest, analysis_id: str):
    youtube_service, gemini_service, supabase = get_services()
    
    try:
        # 1. Update status to 'processing_download'
        supabase.table("video_analyses").update({"status": "downloading"}).eq("id", analysis_id).execute()
        
        # 2. Extract Transcript and Metadata
        print(f"Extracting transcript & metadata for {request.youtube_url}")
        
        try:
            metadata = youtube_service.get_metadata(request.youtube_url)
        except Exception as e:
            print(f"Metadata extraction warning: {e}")
            metadata = {}
            
        transcript_text = request.transcript_text
        if not transcript_text:
            # Fallback to backend extraction if not provided by frontend
            try:
                transcript_text = youtube_service.get_transcript(request.youtube_url)
            except Exception as e:
                raise ValueError(f"Failed to extract transcript from backend: {e}")

        # 3. Update status to 'analyzing'
        supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
        
        # 4. Analyze with Gemini
        print(f"Starting Gemini transcript analysis")
        analysis_result = gemini_service.analyze_full_transcript(transcript_text, metadata)
        
        # Inject real metadata into results for frontend display
        if metadata and analysis_result:
            if "video_metadata" not in analysis_result:
                analysis_result["video_metadata"] = {}
            
            analysis_result["video_metadata"]["channel_title"] = metadata.get("author")
            analysis_result["video_metadata"]["published_date"] = metadata.get("publish_date")
            analysis_result["video_metadata"]["duration_seconds"] = metadata.get("length")

        # 5. Save results
        supabase.table("video_analyses").update({
            "status": "completed",
            "analysis_results": analysis_result,
        }).eq("id", analysis_id).execute()
        
        print(f"Analysis {analysis_id} completed successfully.")
        
    except Exception as e:
        print(f"Analysis {analysis_id} failed: {e}")
        supabase.table("video_analyses").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", analysis_id).execute()

@router.post("/analyze")
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    print(f"DEBUG: Processing analysis request for URL: {request.youtube_url} | User: {request.user_id}")
    youtube_service, gemini_service, supabase = get_services()
    
    # --- DEMO MODE ---
    if request.youtube_url == "DEMO_MODE":
        # Create a mock analysis record
        mock_analysis_id = str(uuid.uuid4())
        mock_results = {
            "summary": "This is a demonstration of the Executive Comms Ninja analysis. The speaker demonstrates strong executive presence with clear articulation and good pacing. However, there are moments of filler word usage that could be reduced.",
            "executive_presence_score": 88,
            "strategic_metrics": {
                "gravitas": 92,
                "clarity": 88,
                "empathy": 80,
                "passion": 85
            },
            "sentiment_arc": [
                {"timestamp": "00:00", "sentiment": 60, "label": "Calm Opening"},
                {"timestamp": "01:15", "sentiment": 75, "label": "Building Momentum"},
                {"timestamp": "02:30", "sentiment": 90, "label": "Peak Passion"},
                {"timestamp": "03:45", "sentiment": 70, "label": "Thoughtful Transition"},
                {"timestamp": "05:00", "sentiment": 85, "label": "Confident Closing"}
            ],
            "timeline": [
                {"timestamp": "00:15", "observation": "Strong opening statement, established credibility early.", "metric": "Gravitas"},
                {"timestamp": "01:30", "observation": "Used a clear analogy to explain complex topic.", "metric": "Clarity"},
                {"timestamp": "02:45", "observation": "Slight hesitation and use of 'um' filler word.", "metric": "Fluency"},
                {"timestamp": "04:20", "observation": "Great eye contact and hand gestures during key point.", "metric": "Passion"}
            ],
            "strengths": [
                "Clear and articulate speaking style",
                "Good use of analogies to simplify concepts",
                "Strong eye contact and engagement",
                "Confident posture and body language"
            ],
            "weaknesses": [
                "Occasional use of filler words (um, uh)",
                "Pacing could be slightly slower in technical sections",
                "Could use more variation in tone for emphasis"
            ]
        }
        
        try:
            supabase.table("video_analyses").insert({
                "id": mock_analysis_id,
                "user_id": request.user_id,
                "youtube_url": "https://www.youtube.com/watch?v=demo_video",
                "video_title": "Executive Presence Demo",
                "company": request.company,
                "role": request.role,
                "target_person": request.target_person,
                "status": "completed",
                "analysis_results": mock_results
            }).execute()
            
            return {"status": "completed", "analysis_id": mock_analysis_id}
            
        except Exception as e:
             import traceback
             traceback.print_exc()
             print(f"DEMO MODE ERROR: {e}")
             raise HTTPException(status_code=500, detail=f"Demo mode failed: {str(e)}")
    # --- END DEMO MODE ---

    try:
        # 1. Create a record in Supabase immediately
        data = {
            "user_id": request.user_id,
            "youtube_url": request.youtube_url,
            "video_title": request.video_title,
            "company": request.company,
            "role": request.role,
            "target_person": request.target_person,
            "status": "pending"
        }
        
        response = supabase.table("video_analyses").insert(data).execute()
        analysis_id = response.data[0]['id']
        
        # 2. Start background task
        background_tasks.add_task(process_analysis, request, analysis_id)
        
        return {"status": "queued", "analysis_id": analysis_id}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        # If analysis_id was created but task failed to schedule (unlikely), we still return success-ish
        # But if creation failed, we raise 500
        if 'analysis_id' in locals():
             return {"status": "queued", "analysis_id": analysis_id}
        raise HTTPException(status_code=500, detail=f"Failed to start analysis: {str(e)}")

@router.get("/analyze/{analysis_id}")
async def get_analysis(analysis_id: str):
    youtube_service, gemini_service, supabase = get_services()
    
    try:
        response = supabase.table("video_analyses").select("*").eq("id", analysis_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
