import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = os.getenv("gemini_api_key")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

try:
    response = model.generate_content("What is spoken in this video? Please provide a brief text transcript. https://www.youtube.com/watch?v=E7wUGafs0LY")
    print(response.text)
except Exception as e:
    print("Error:", e)
