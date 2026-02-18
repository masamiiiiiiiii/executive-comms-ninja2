
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models
import google.generativeai as genai
import os
import json
import time

class GeminiService:
    def __init__(self, project_id: str = None, location: str = "us-central1"):
        self.use_api_key = False
        
        # Check for API Key first (Local Development Mode)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
             # Try alternate env var just in case
             api_key = os.getenv("gemini_api_key")

        if api_key:
            print("Using Gemini API Key Authentication (Local Mode)")
            genai.configure(api_key=api_key)
            # Use the model confirmed to work: gemini-2.0-flash
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            self.use_api_key = True
        elif project_id:
            # Fallback to Vertex AI (Production/Cloud Run Mode)
            print(f"Using Vertex AI Authentication (Project: {project_id})")
            vertexai.init(project=project_id, location=location)
            self.model = GenerativeModel("gemini-1.5-flash")
        else:
             print("Warning: No Gemini Auth configured.")

    def analyze_video(self, video_path: str) -> dict:
        """
        Analyzes a video.
        If API Key is used, 'video_path' must be a local file path.
        If Vertex AI is used, 'video_path' should be a GCS URI (gs://...).
        """
        prompt = """
        You are an elite Executive Communication Coach for the AI era. Analyze this video with high precision to generate a comprehensive "Executive Dashboard" report.

        **Objective**: Evaluate the speaker's executive presence, credibility, and communication effectiveness against global C-suite standards.

        **Output**: Return a strict JSON object with this EXACT structure (ensure all fields are present):
        {
            "analysis_reliability": {
                "score": 90,
                "notice": "High confidence analysis based on clear audio and video quality."
            },
            "video_metadata": {
                "duration": "Duration Unknown",
                "published_date": "Unknown"
            },
            "overall_performance": {
                "score": 85,
                "level": "Excellent",
                "summary": "Comprehensive assessment of B2B communication effectiveness.",
                "badge": "Top Performer"
            },
            "high_level_metrics": {
                "confidence": {"score": 90, "label": "Confidence"},
                "trustworthiness": {"score": 85, "label": "Trustworthiness"},
                "engagement": {"score": 80, "label": "Engagement"},
                "clarity": {"score": 85, "label": "Clarity"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "Optimal Pace",
                    "pause_frequency": "Appropriate",
                    "volume_variation": "Dynamic",
                    "clarity_rating": "Good",
                    "observation": "Speaker maintains a steady 140wpm pace, ideal for comprehension."
                },
                "message_analysis": {
                    "keyword_density": "Appropriate",
                    "emotional_tone": "Positive",
                    "structure_rating": "Logical",
                    "logic_flow": "Well-organized",
                    "observation": "Key themes are reinforced with clear signposting."
                }
            },
            "emotion_radar": {
                "confidence": 90,
                "empathy": 70,
                "authority": 85,
                "composure": 80,
                "enthusiasm": 75,
                "trust": 88
            },
            "timeline_analysis": [
                {
                    "timestamp": "00:15",
                    "event": "Strong opening",
                    "sentiment": "positive",
                    "emotion_label": "Confident",
                    "confidence_score": 85,
                    "engagement_score": 87,
                    "insight": "Strong opening with market overview. Positive impact on audience engagement."
                },
                {
                    "timestamp": "01:30",
                    "event": "Technical explanation",
                    "sentiment": "neutral",
                    "emotion_label": "Focused",
                    "confidence_score": 95,
                    "engagement_score": 90,
                    "insight": "Technical detail explanation becomes complex. Maintains baseline trust."
                }
            ],
            "benchmark_comparison": {
                "your_score": 85,
                "industry_average": 72,
                "top_ceos": 92,
                "metrics": ["Confidence", "Trustworthiness", "Engagement", "Clarity", "Voice Stability"],
                "emotion_radar_benchmark": {
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 90,
                    "composure": 85,
                    "enthusiasm": 70,
                    "trust": 85
                }
            },
            "recommendations": [
                {
                    "title": "Include more relatable examples",
                    "rationale": "Makes technical content more accessible.",
                    "strategy": "Add industry-specific use cases and success stories.",
                    "priority": "Medium",
                    "timeframe": "2-4 weeks",
                    "expected_impact": "10-15%"
                }
            ],
            "summary": "A detailed narrative summary of the performance..."
        }
        """

        if self.use_api_key:
            # --- API Key Mode (Local File) ---
            print(f"Uploading file {video_path} to Gemini...")
            
            if not os.path.exists(video_path):
                raise ValueError(f"Local video file not found: {video_path}")

            video_file = genai.upload_file(path=video_path)
            
            # Wait for processing
            print(f"Waiting for video processing: {video_file.name}")
            while video_file.state.name == "PROCESSING":
                print(".", end='', flush=True)
                time.sleep(2)
                video_file = genai.get_file(video_file.name)
            print("Done.")
            
            if video_file.state.name == "FAILED":
                raise ValueError("Gemini file processing failed.")

            print("Generating analysis content...")
            response = self.model.generate_content(
                [video_file, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Cleanup remote file (best practice)
            # genai.delete_file(video_file.name) 
            
            return self._parse_response(response.text)

        else:
            # --- Vertex AI Mode (GCS URI) ---
            video = Part.from_uri(mime_type="video/mp4", uri=video_path)
            
            responses = self.model.generate_content(
                [video, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_response(responses.text)

    def _parse_response(self, text: str) -> dict:
        try:
            clean_text = text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            return json.loads(clean_text.strip())
        except Exception as e:
            print(f"Error parsing response: {e}")
            return {"error": str(e), "raw": text}
