
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase credentials missing")
    exit(1)

supabase: Client = create_client(url, key)

try:
    # Fetch the 5 most recent records
    response = supabase.table("video_analyses") \
        .select("id, created_at, status, youtube_url, error_message, analysis_results") \
        .order("created_at", desc=True) \
        .limit(5) \
        .execute()

    print(f"Found {len(response.data)} records:")
    for record in response.data:
        print("-" * 50)
        print(f"ID: {record['id']}")
        print(f"Created: {record['created_at']}")
        print(f"Status: {record['status']}")
        print(f"URL: {record['youtube_url']}")
        if record['error_message']:
            print(f"Error: {record['error_message']}")
        if record['analysis_results']:
             print(f"Analysis Results Keys: {list(record['analysis_results'].keys())}")
        else:
             print("Analysis Results: None/Empty")

except Exception as e:
    print(f"Query Failed: {e}")
