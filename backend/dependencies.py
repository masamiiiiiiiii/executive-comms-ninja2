
import os
from fastapi import HTTPException
from services.youtube_service import YouTubeService
from services.gemini_service import GeminiService
from supabase import create_client, Client

def get_services():
    bucket_name = os.getenv("GCP_BUCKET_NAME")
    project_id = os.getenv("GCP_PROJECT_ID") 
    
    # Fallback/Debug logic (simplified from analysis.py)
    if not project_id:
        try:
            sa_path = "service_account.json"
            if os.path.exists(sa_path):
                import json
                with open(sa_path, "r") as f:
                    sa = json.load(f)
                    project_id = sa.get("project_id")
        except Exception as e:
            print(f"Could not load project_id from service_account.json: {e}")

    if not project_id and not os.getenv("GEMINI_API_KEY") and not os.getenv("gemini_api_key"):
        # If we are strictly in cloud run without env vars, this might be an issue. 
        # But let's assume if API KEY is present, we don't strictly need project_id for Gemini (though we might for other things)
        pass

    try:
        # YouTubeService might need bucket_name for GCS, but if local mode, it might not use it immediately.
        youtube_service = YouTubeService(bucket_name)
        gemini_service = GeminiService(project_id)
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
             # Just a warning for now, specialized endpoints might not need supabase
             print("Warning: Supabase credentials missing.")
             supabase = None
        else:
             supabase = create_client(supabase_url, supabase_key)
        
        return youtube_service, gemini_service, supabase
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Service Initialization Error: {e}")
