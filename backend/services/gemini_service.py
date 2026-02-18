import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models
import os
import json

class GeminiService:
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-1.5-pro-001")

    def analyze_video(self, gcs_uri: str) -> dict:
        """
        Analyzes a video stored in GCS using Gemini 1.5 Pro.
        Returns a structured dictionary with appropriate analysis.
        """
        prompt = """
        You are an expert Executive Communication Coach. Analyze the following video of an executive interview/presentation.
        
        Provide the output in strict JSON format with the following structure:
        {
            "executive_presence_score": 85,
            "summary": "Brief summary of the performance.",
            "strengths": ["List of strong points"],
            "weaknesses": ["List of areas for improvement"],
            "timeline": [
                {"time": "00:30", "event": "Strong opening statement", "impact": "positive"},
                {"timestamp": "01:15", "observation": "Strong hand gesture emphasizes key point.", "metric": "Gravitas"},
                {"timestamp": "02:45", "observation": "Slight hesitation/break in eye contact.", "metric": "Confidence"}
            ],
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
        }
        """

        video = Part.from_uri(
            mime_type="video/mp4",
            uri=gcs_uri
        )

        generation_config = {
            "max_output_tokens": 8192,
            "temperature": 0.2,
            "top_p": 0.95,
            "response_mime_type": "application/json",
        }

        safety_settings = {
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }

        responses = self.model.generate_content(
            [video, prompt],
            generation_config=generation_config,
            safety_settings=safety_settings,
            stream=False,
        )

        try:
            return json.loads(responses.text)
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            print(f"Raw response: {responses.text}")
            return {
                "error": "Failed to parse AI response",
                "raw": responses.text
            }
