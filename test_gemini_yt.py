import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = os.getenv("gemini_api_key")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

response = model.generate_content("What is spoken in this video? https://www.youtube.com/watch?v=E7wUGafs0LY")
print(response.text)
