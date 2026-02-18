import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

analysis_id = "f97de2d8-212b-467d-ad33-37a07aa19dc8"

try:
    response = supabase.table("video_analyses").select("status, error_message").eq("id", analysis_id).single().execute()
    print(f"Status: {response.data['status']}")
    print(f"Error Message: {response.data['error_message']}")
except Exception as e:
    print(f"Error fetching analysis: {e}")
