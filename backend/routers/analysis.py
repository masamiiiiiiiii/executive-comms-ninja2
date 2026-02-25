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

    if not project_id and not os.getenv("GEMINI_API_KEY") and not os.getenv("gemini_api_key"):
        print("ERROR: Project ID or API Key is missing.")
        raise HTTPException(status_code=500, detail="Configuration Error: Project ID or API Key missing")

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
        analysis_result = None
        
        if not transcript_text:
            # Fallback to backend extraction if not provided by frontend
            try:
                print(f"Attempting transcript extraction for {request.youtube_url}")
                transcript_text = youtube_service.get_transcript(request.youtube_url)
                
                # 3. Update status to 'analyzing'
                supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
                
                # 4. Analyze with Gemini (Transcript mode)
                print(f"Starting Gemini transcript analysis")
                analysis_result = gemini_service.analyze_full_transcript(transcript_text, metadata)
                
            except Exception as e:
                print(f"Transcript extraction failed, falling back to VIDEO analysis: {e}")
                
                # Update status to 'downloading'
                supabase.table("video_analyses").update({"status": "downloading"}).eq("id", analysis_id).execute()
                
                # 1. Download Video (Audio + Vision)
                video_path = youtube_service.download_video(request.youtube_url)
                
                # 2. Update status to 'analyzing'
                supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
                
                # 3. Run Multimodal Analysis (Includes facial expressions, eye contact)
                print(f"Starting Gemini VIDEO analysis")
                analysis_result = gemini_service.analyze_video(video_path, metadata)
                
                # 4. Cleanup temp file
                try:
                    import shutil
                    shutil.rmtree(os.path.dirname(video_path))
                except:
                    pass
        else:
             # Manual transcript provided
             supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
             analysis_result = gemini_service.analyze_full_transcript(transcript_text, metadata)

        # 5. Inject real metadata into results for frontend display
        if metadata and analysis_result:
            if "video_metadata" not in analysis_result:
                analysis_result["video_metadata"] = {}
            
            analysis_result["video_metadata"]["channel_title"] = metadata.get("author")
            analysis_result["video_metadata"]["published_date"] = metadata.get("publish_date")
            analysis_result["video_metadata"]["duration_seconds"] = metadata.get("length")
            
            # Fallback for Target Person Name if AI failed to extract it
            if not analysis_result["video_metadata"].get("extracted_interviewee_name") or analysis_result["video_metadata"].get("extracted_interviewee_name") == "Unknown":
                analysis_result["video_metadata"]["extracted_interviewee_name"] = metadata.get("author")

        # 6. Save results
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
            "analysis_reliability": {
                "score": 98,
                "notice": "High confidence analysis based on legendary Jack Welch interview footage."
            },
            "video_metadata": {
                "duration": "09:12",
                "published_date": "2018-05-15",
                "extracted_interviewee_name": "Jack Welch",
                "channel_title": "Leadership Vault"
            },
            "overall_performance": {
                "score": 96,
                "level": "Legendary",
                "summary": "This is a demonstration of the Executive Comms Ninja analysis using Jack Welch's classic interview footage. The speaker demonstrates unparalleled executive presence characterized by extreme candor, high energy, and absolute conviction. His direct, no-nonsense communication style cuts effortlessly through corporate jargon.",
                "badge": "Master Communicator"
            },
            "high_level_metrics": {
                "confidence": {"score": 98, "label": "Confidence"},
                "trustworthiness": {"score": 90, "label": "Authenticity"},
                "engagement": {"score": 95, "label": "Engagement"},
                "clarity": {"score": 94, "label": "Clarity"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "Energetic Pace",
                    "pause_frequency": "Strategic",
                    "volume_variation": "Highly Dynamic",
                    "clarity_rating": "Excellent",
                    "observation": "Speaker maintained an energetic, staccato rhythm. He frequently leaned in and used volume shifts to passionately emphasize core principles like 'candor' and 'differentiation'."
                },
                "message_analysis": {
                    "keyword_density": "Very High",
                    "emotional_tone": "Assertive",
                    "structure_rating": "Direct",
                    "logic_flow": "Anecdote-driven",
                    "observation": "Utterly void of corporate speak. Messages were delivered with blunt honesty, using personal anecdotes to enforce a strict meritocratic philosophy."
                }
            },
            "emotion_radar": {
                "confidence": 98,
                "empathy": 65,
                "authority": 99,
                "composure": 90,
                "enthusiasm": 96,
                "trust": 88
            },
            "timeline_analysis": [
                {
                    "timestamp": "00:25",
                    "event": "Blunt Assertion",
                    "sentiment": "neutral",
                    "emotion_label": "Authoritative",
                    "confidence_score": 99,
                    "engagement_score": 90,
                    "insight": "Immediately took control of the narrative, establishing dominance with a blunt truth about organizational candor."
                },
                {
                    "timestamp": "02:10",
                    "event": "Passionate Anecdote",
                    "sentiment": "positive",
                    "emotion_label": "Enthusiastic",
                    "confidence_score": 95,
                    "engagement_score": 96,
                    "insight": "Leaned forward, increasing vocal intensity to passionately describe the 20-70-10 differentiation rule."
                },
                {
                    "timestamp": "05:40",
                    "event": "No-Nonsense Rebuttal",
                    "sentiment": "neutral",
                    "emotion_label": "Intense",
                    "confidence_score": 98,
                    "engagement_score": 92,
                    "insight": "Swiftly dismissed a premise in the interviewer's question, cutting straight to the core business reality."
                }
            ],
            "benchmark_comparison": {
                "your_score": 96,
                "industry_average": 74,
                "top_ceos": 91,
                "metrics": ["Confidence", "Authority", "Energy", "Clarity"],
                "emotion_radar_benchmark": {
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 88,
                    "composure": 82,
                    "enthusiasm": 75,
                    "trust": 85
                }
            },
            "recommendations": [
                {
                    "title": "Soften delivery for highly sensitive topics",
                    "rationale": "Extreme candor can sometimes alienate a subset of the modern workforce.",
                    "strategy": "Incorporate a brief empathetic preamble before delivering hard truths to broaden receptivity.",
                    "priority": "Low",
                    "timeframe": "Ongoing",
                    "expected_impact": "5%"
                }
            ],
            "key_takeaways": [
                "Master-class in conveying absolute conviction and authority through visceral, energetic delivery.",
                "Zero reliance on corporate jargon; language was accessible, blunt, and highly memorable.",
                "A vivid demonstration of 'Executive Presence' defined by sheer force of personality rather than polished perfection."
            ],
            "summary": "A masterful display of executive presence and authority. Jack Welch navigated the interview with extreme candor and high energy, translating complex business philosophies into accessible, hard-hitting truths. The primary hallmark of his style is a complete absence of corporate speak, relying instead on pure conviction to command the room."
        }
        
        try:
            supabase.table("video_analyses").insert({
                "id": mock_analysis_id,
                "user_id": request.user_id,
                "youtube_url": "https://www.youtube.com/watch?v=VM0AU-vPNeQ", # Real video for demo player seeking
                "status": "completed",
                "video_title": request.video_title,
                "target_person": request.target_person,
                "role": request.role,
                "company": request.company,
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
