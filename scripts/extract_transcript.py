import os
import sys
import google.generativeai as genai
import time

# Load env vars
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found.")
    sys.exit(1)

genai.configure(api_key=api_key)

def transcribe_video(video_path):
    print(f"Uploading {video_path} to Gemini...")
    video_file = genai.upload_file(path=video_path)
    
    print("Waiting for file to process...")
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = genai.get_file(video_file.name)
        
    if video_file.state.name == "FAILED":
        print("File processing failed.")
        sys.exit(1)
        
    print("File ready. Generating transcript...")
    model = genai.GenerativeModel(model_name="gemini-2.5-pro")
    prompt = "Please provide a complete and accurate transcription of the English voiceover in this video. Only output the transcripttext, nothing else."
    
    response = model.generate_content([video_file, prompt])
    print("\n--- TRANSCRIPT ---")
    print(response.text)
    print("------------------")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        transcribe_video(sys.argv[1])
    else:
        print("Usage: python extract_transcript.py <video_path>")
