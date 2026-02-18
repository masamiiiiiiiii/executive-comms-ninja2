
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("backend/.env")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Try alternate name if user used different one but unlikely
    api_key = os.getenv("gemini_api_key")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in backend/.env")
    exit(1)

print(f"API Key Found: {api_key[:10]}********")
genai.configure(api_key=api_key)

try:
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")

    print("Testing basic generation...")
    model = genai.GenerativeModel('gemini-2.0-flash') 
    response = model.generate_content("Hello! Are you working?")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR During Generation: {e}")
