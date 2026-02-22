
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
                "published_date": "Unknown",
                "extracted_interviewee_name": "Jon Lin"
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
            "key_takeaways": [
                "Established strong credibility early with confident eye contact.",
                "Effectively simplified complex technical pipeline for general audience.",
                "Should rely more on silence rather than filler words during transitions."
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
    def analyze_audio_multimodal(self, audio_path: str) -> dict:
        """
        Analyzes an audio file directly using Gemini's multimodal capabilities.
        This provides deeper analysis of tone, pacing, and confidence than transcript-only analysis.
        """
        prompt = """
        You are an elite Executive Communication Coach for the AI era. Listen to this audio recording of an executive's speech or interview.
        
        **Objective**: Evaluate the speaker's executive presence, voice tone, pacing, confidence, and message clarity against global C-suite standards.
        
        **Analysis Focus**:
        1. **Confidence & Authority**: Detect signs of hesitation, fillers (ums, uhs), and vocal projection.
        2. **Emotional Tone**: Analyze the underlying sentiment and enthusiasm.
        3. **Clarity & Articulation**: Is the message easy to follow?
        4. **Pacing**: Is the speaking rate optimal for an executive audience?

        **Output**: Return a strict JSON object with this EXACT structure (ensure all fields are present):
        {
            "analysis_reliability": {
                "score": 95,
                "notice": "High confidence analysis based on direct audio observation."
            },
            "video_metadata": {
                "duration": "Detected from audio",
                "published_date": "Unknown"
            },
            "overall_performance": {
                "score": 85,
                "level": "Excellent",
                "summary": "Detailed assessmet based on vocal delivery and content.",
                "badge": "Authentic Leader"
            },
            "high_level_metrics": {
                "confidence": {"score": 90, "label": "Confidence"},
                "trustworthiness": {"score": 85, "label": "Trustworthiness"},
                "engagement": {"score": 80, "label": "Engagement"},
                "clarity": {"score": 85, "label": "Clarity"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "Analyzed from audio",
                    "pause_frequency": "Analyzed from audio",
                    "volume_variation": "Analyzed from audio",
                    "clarity_rating": "Analyzed from audio",
                    "observation": "Provide a detailed observation based on what you HEAR."
                },
                "message_analysis": {
                    "keyword_density": "Appropriate",
                    "emotional_tone": "Analyzed from audio",
                    "structure_rating": "Logical",
                    "logic_flow": "Well-organized",
                    "observation": "Identify key themes and structural effectiveness."
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
                    "timestamp": "00:05",
                    "event": "Detected opening tone",
                    "sentiment": "positive",
                    "emotion_label": "Confident",
                    "confidence_score": 90,
                    "engagement_score": 85,
                    "insight": "Observation from the audio start."
                }
            ],
            "benchmark_comparison": {
                "your_score": 85,
                "industry_average": 72,
                "top_ceos": 92,
                "metrics": ["Confidence", "Voice Stability", "Articulation", "Tone"],
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
                    "title": "Reduce filler words",
                    "rationale": "Improves perceived authority.",
                    "strategy": "Practice comfortable silence instead of 'um'.",
                    "priority": "High",
                    "timeframe": "Immediate",
                    "expected_impact": "15%"
                }
            ],
            "key_takeaways": [
                "Point 1",
                "Point 2",
                "Point 3"
            ],
            "summary": "Comprehensive narrative summary based on what you heard..."
        }
        """

        if self.use_api_key:
            # --- API Key Mode (Local File) ---
            print(f"Uploading audio {audio_path} to Gemini...")
            if not os.path.exists(audio_path):
                raise ValueError(f"Local audio file not found: {audio_path}")

            audio_file = genai.upload_file(path=audio_path)
            
            # Wait for processing
            print(f"Waiting for audio processing: {audio_file.name}")
            start_time = time.time()
            while audio_file.state.name == "PROCESSING":
                print(".", end='', flush=True)
                time.sleep(2)
                audio_file = genai.get_file(audio_file.name)
                if time.time() - start_time > 120: # 2 min timeout
                    raise TimeoutError("Gemini audio processing timed out.")
            print("Done.")
            
            if audio_file.state.name == "FAILED":
                raise ValueError("Gemini audio processing failed.")

            response = self.model.generate_content(
                [audio_file, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_response(response.text)

        else:
            # --- Vertex AI Mode (GCS URI) ---
            # Assumption: audio_path is a GCS URI like gs://...
            if not audio_path.startswith("gs://"):
                # If it's a local file in prod, we need to upload to GCS first
                # But for now, let's assume the caller handles GCS upload if using Vertex
                audio = Part.from_data(data=open(audio_path, 'rb').read(), mime_type="audio/mpeg")
            else:
                audio = Part.from_uri(mime_type="audio/mpeg", uri=audio_path)
            
            response = self.model.generate_content(
                [audio, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_response(response.text)

    def analyze_full_transcript(self, transcript_text: str, metadata: dict) -> dict:
        """
        Analyzes a full video transcript as an alternative to analyzing the raw video file.
        This bypasses the need to download the video, avoiding YouTube bot blocking.
        """
        prompt = """
        You are an elite Executive Communication Coach for the AI era. You are analyzing a transcript of an executive's speech or presentation to generate a comprehensive "Executive Dashboard" report.
        Even though you cannot see the video, evaluate their communication style based on the spoken text, structure, pacing (implied by content), and implicit tone.

        **Objective**: Evaluate the speaker's executive credibility, communication effectiveness, and structure against global C-suite standards based on this transcript.

        **Output**: Return a strict JSON object with this EXACT structure (ensure all fields are present):
        {
            "analysis_reliability": {
                "score": 85,
                "notice": "Analysis is based on text transcript only. Visual and vocal nuances (like posture and exact tone) are inferred from content structure and language choice."
            },
            "video_metadata": {
                "duration": "Duration Unknown",
                "published_date": "Unknown"
            },
            "overall_performance": {
                "score": 85,
                "level": "Excellent",
                "summary": "Comprehensive assessment based on transcript.",
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
                    "speaking_rate": "Not Evaluated",
                    "pause_frequency": "Not Evaluated",
                    "volume_variation": "Not Evaluated",
                    "clarity_rating": "Good",
                    "observation": "Voice metrics cannot be fully evaluated from transcript alone. Language suggests a confident delivery."
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
                    "timestamp": "00:00",
                    "event": "Opening",
                    "sentiment": "positive",
                    "emotion_label": "Confident",
                    "confidence_score": 85,
                    "engagement_score": 87,
                    "insight": "Opening statement sets a strong tone."
                }
            ],
            "benchmark_comparison": {
                "your_score": 85,
                "industry_average": 72,
                "top_ceos": 92,
                "metrics": ["Confidence", "Trustworthiness", "Engagement", "Clarity"],
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
                    "timeframe": "1 week",
                    "expected_impact": "10-15%"
                }
            ],
            "key_takeaways": [
                "Point 1",
                "Point 2",
                "Point 3"
            ],
            "summary": "Narrative summary of the speech..."
        }
        
        Analyze the following transcript:
        """ + transcript_text

        try:
            if self.use_api_key:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
            else:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
            return self._parse_response(response.text)
        except Exception as e:
            print(f"Transcript full analysis failed: {e}")
            raise e

    def analyze_snapshot(self, image_data: bytes, mime_type: str = "image/jpeg") -> dict:
        """
        Analyzes a single image snapshot.
        """
        prompt = """
        Analyze this video snapshot to evaluate the Executive Presence of the main spokesperson.

        **Target Identification Rules**:
        1. Identify the primary speaker who is being interviewed (the guest/executive).
        2. **Prioritize the person associated with "Equinix"** if visible in text overlays (lower thirds) or background logos.
        3. Ignore the interviewer/host (usually the one asking questions or positioned as the anchor).
        4. If unsure, focus on the person acting as the domain expert or answering questions.

        **Analysis**:
        Evaluate their facial expression, eye contact, hand gestures, and posture.

        Return a JSON object with:
        {
            "score": (0-100 integer reflecting confidence and authority),
            "feedback": "Concise feedback focusing on the spokesperson's delivery (max 20 words).",
            "emotion": "Current detected emotion (e.g., Confident, Thoughtful, Defensive)",
            "key_observation": "Brief observation on why they look authoritative (or not)."
        }
        """
        
        try:
            if self.use_api_key:
                # --- API Key Mode ---
                # genai supports PIL Image or bytes? 
                # For safety, let's wrap contents in a list
                # We need to construct a 'blob' for genai if passing raw bytes is tricky, 
                # but usually it accepts a dict {'mime_type': ..., 'data': ...}
                image_blob = {'mime_type': mime_type, 'data': image_data}
                
                response = self.model.generate_content(
                    [prompt, image_blob],
                    generation_config={"response_mime_type": "application/json"}
                )
                return self._parse_response(response.text)
                
            else:
                # --- Vertex AI Mode ---
                image_part = Part.from_data(data=image_data, mime_type=mime_type)
                
                response = self.model.generate_content(
                    [image_part, prompt],
                    generation_config={"response_mime_type": "application/json"}
                )
                return self._parse_response(response.text)
                
        except Exception as e:
            print(f"Snapshot analysis failed: {e}")
            return {"error": str(e), "score": 0, "feedback": "Analysis failed."}

    def analyze_audio(self, audio_data: bytes, mime_type: str = "audio/webm") -> dict:
        """
        Analyzes a short audio chunk.
        """
        prompt = """
        Listen to this audio clip of an executive speaker.
        Evaluate their vocal delivery based on:
        1. **Confidence** (tone stability, projection)
        2. **Fluency** (pace, use of fillers like 'um', 'uh')
        3. **Clarity** (articulation)

        Return a JSON object:
        {
            "score": (0-100 integer),
            "feedback": "Brief feedback on vocal performance (max 15 words).",
            "metric": "Key strength or weakness observed (e.g., 'Monotone', 'Dynamic', 'Too Fast')"
        }
        """
        
        try:
            if self.use_api_key:
                audio_blob = {'mime_type': mime_type, 'data': audio_data}
                response = self.model.generate_content(
                    [prompt, audio_blob],
                    generation_config={"response_mime_type": "application/json"}
                )
                return self._parse_response(response.text)
            else:
                audio_part = Part.from_data(data=audio_data, mime_type=mime_type)
                response = self.model.generate_content(
                    [audio_part, prompt],
                    generation_config={"response_mime_type": "application/json"}
                )
                return self._parse_response(response.text)
                
        except Exception as e:
            print(f"Audio analysis failed: {e}")
            return {"error": str(e), "score": 0, "feedback": "Audio analysis failed."}

    def analyze_transcript(self, text: str) -> dict:
        """
        Analyzes a short transcript text.
        """
        prompt = f"""
        Analyze this spoken sentence by an executive (in any language):
        "{text}"
        
        Evaluate based on:
        1. **Clarity** (Is it easy to understand?)
        2. **Impact** (Is it persuasive?)
        3. **Professionalism** (Vocabulary choice)

        Return a JSON object ONLY. No markdown formatting.
        {{
            "score": (0-100 integer),
            "metric": "Key quality (e.g., 'Concise', 'Vague', 'Powerful')",
            "feedback": "Brief feedback in English (max 10 words)."
        }}
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return self._parse_response(response.text)
        except Exception as e:
            print(f"Transcript analysis failed: {e}")
            return {"error": str(e), "score": 0, "feedback": "Analysis failed."}

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
