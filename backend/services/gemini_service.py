
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

    def analyze_video(self, video_path: str, metadata: dict = None, target_person: str = None) -> dict:
        """
        Analyzes a video.
        If API Key is used, 'video_path' must be a local file path.
        If Vertex AI is used, 'video_path' should be a GCS URI (gs://...).
        """
        target_instruction = ""
        if target_person and target_person.lower() != "speaker":
            target_instruction = f"\n\n**CRITICAL REQUIREMENT: IDENTIFY AND ANALYZE THE SPECIFIC PERSON NAMED '{target_person}'.**\nIf multiple people are present, you MUST focus your entire analysis exclusively on '{target_person}'. Do not analyze the interviewer or other participants.\n"

        prompt = f"""
        You are an elite Executive Communication Coach for the AI era. Analyze this video with high precision to generate a comprehensive "Executive Dashboard" report.{target_instruction}

        **Objective**: Evaluate the speaker's executive presence, credibility, and communication effectiveness against global C-suite standards.

        **Output**: Return a strict JSON object matching this EXACT schema. YOU MUST REPLACE ALL PLACEHOLDER VALUES WITH YOUR ACTUAL ANALYSIS:
        {{
            "analysis_reliability": {{
                "score": "[0-100 integer]",
                "notice": "[Brief explanation of analysis confidence]"
            }},
            "video_metadata": {{
                "duration": "[Duration if known, else 'Unknown']",
                "published_date": "Unknown",
                "extracted_interviewee_name": "[Identify the main speaker from context]"
            }},
            "overall_performance": {{
                "score": "[0-100 integer]",
                "level": "[e.g., Excellent, Good, Average, Needs Improvement]",
                "summary": "[Brief 1-sentence summary of overall performance]",
                "badge": "[e.g., Top Performer, Trusted Advisor, Visionary]"
            }},
            "high_level_metrics": {{
                "confidence": {{"score": "[0-100 integer]", "label": "Confidence"}},
                "trustworthiness": {{"score": "[0-100 integer]", "label": "Trustworthiness"}},
                "engagement": {{"score": "[0-100 integer]", "label": "Engagement"}},
                "clarity": {{"score": "[0-100 integer]", "label": "Clarity"}}
            }},
            "detailed_analysis": {{
                "voice_analysis": {{
                    "speaking_rate": "[e.g., Optimal Pace, Fast, Slow]",
                    "pause_frequency": "[e.g., Appropriate, Too Few, Too Many]",
                    "volume_variation": "[e.g., Dynamic, Monotone]",
                    "clarity_rating": "[e.g., Good, Fair, Poor]",
                    "observation": "[1-sentence observation on vocal delivery]"
                }},
                "message_analysis": {{
                    "keyword_density": "[e.g., Appropriate, High, Low]",
                    "emotional_tone": "[e.g., Positive, Neutral, Serious, Passionate]",
                    "structure_rating": "[e.g., Logical, Rambling, Structured]",
                    "logic_flow": "[e.g., Well-organized, Hard to follow]",
                    "observation": "[1-sentence observation on message structure]"
                }}
            }},
            "emotion_radar": {{
                "confidence": "[0-100 integer]",
                "empathy": "[0-100 integer]",
                "authority": "[0-100 integer]",
                "composure": "[0-100 integer]",
                "enthusiasm": "[0-100 integer]",
                "trust": "[0-100 integer]"
            }},
            "timeline_analysis": [
                {{
                    "timestamp": "[MM:SS]",
                    "event": "[Short title of the event at this timestamp]",
                    "sentiment": "[positive/neutral/negative]",
                    "emotion_label": "[e.g., Confident, Focused, Hesitant]",
                    "confidence_score": "[0-100 integer]",
                    "engagement_score": "[0-100 integer]",
                    "insight": "[Actionable insight about the speaker's delivery at this exact moment]"
                }}
            ],
            "benchmark_comparison": {{
                "your_score": "[Same as overall_performance.score]",
                "industry_average": 72,
                "top_ceos": 92,
                "metrics": ["Confidence", "Trustworthiness", "Engagement", "Clarity", "Voice Stability"],
                "emotion_radar_benchmark": {{
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 90,
                    "composure": 85,
                    "enthusiasm": 70,
                    "trust": 85
                }}
            }},
            "recommendations": [
                {{
                    "title": "[Actionable recommendation title]",
                    "rationale": "[Why this matters]",
                    "strategy": "[How to achieve this]",
                    "priority": "[High/Medium/Low]",
                    "timeframe": "[e.g., Immediate, 1-2 weeks]",
                    "expected_impact": "[e.g., Significant, Moderate]"
                }}
            ],
            "key_takeaways": [
                "[Highlight 1]",
                "[Highlight 2]",
                "[Highlight 3]"
            ],
            "summary": "WRITE A HIGHLY INSIGHTFUL, ELITE EXECUTIVE COACH'S NOTE HERE based on the actual video. Do not write a plain summary. Write 2-3 hard-hitting paragraphs analyzing their psychological presence, tactical communication strengths, and precise areas where they are leaking authority or engagement. Use professional consulting terminology."
        }}
        """

        if metadata and metadata.get("description"):
            prompt += f"\n\n**Additional Context (Video Description)**:\n{metadata['description']}\n\n*Use the above description to help identify the true name of the speaker if possible.*"

        if self.use_api_key:
            # --- API Key Mode (Local File) ---
            print(f"Uploading file {video_path} to Gemini...")
            
            if not os.path.exists(video_path):
                raise ValueError(f"Local video file not found: {video_path}")

            import mimetypes
            mime_type, _ = mimetypes.guess_type(video_path)
            if not mime_type:
                mime_type = "video/mp4" # Safe fallback

            video_file = genai.upload_file(path=video_path, mime_type=mime_type)
            
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

        **Output**: Return a strict JSON object matching this EXACT schema. YOU MUST REPLACE ALL PLACEHOLDER VALUES WITH YOUR ACTUAL ANALYSIS:
        {
            "analysis_reliability": {
                "score": "[0-100 integer]",
                "notice": "[Brief explanation of analysis confidence from audio]"
            },
            "video_metadata": {
                "duration": "[Estimated duration]",
                "published_date": "Unknown"
            },
            "overall_performance": {
                "score": "[0-100 integer]",
                "level": "[e.g., Excellent, Good, Average, Needs Improvement]",
                "summary": "[Brief 1-sentence summary based on vocal delivery]",
                "badge": "[e.g., Authentic Leader, Dynamic Speaker]"
            },
            "high_level_metrics": {
                "confidence": {"score": "[0-100 integer]", "label": "Confidence"},
                "trustworthiness": {"score": "[0-100 integer]", "label": "Trustworthiness"},
                "engagement": {"score": "[0-100 integer]", "label": "Engagement"},
                "clarity": {"score": "[0-100 integer]", "label": "Clarity"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "[e.g., Optimal Pace, Fast, Slow]",
                    "pause_frequency": "[e.g., Appropriate, Too Few, Too Many]",
                    "volume_variation": "[e.g., Dynamic, Monotone]",
                    "clarity_rating": "[e.g., Good, Fair, Poor]",
                    "observation": "[1-sentence observation based on what you HEAR]"
                },
                "message_analysis": {
                    "keyword_density": "[e.g., Appropriate, High, Low]",
                    "emotional_tone": "[e.g., Positive, Neutral, Serious, Passionate]",
                    "structure_rating": "[e.g., Logical, Rambling, Structured]",
                    "logic_flow": "[e.g., Well-organized, Hard to follow]",
                    "observation": "[1-sentence observation on structure and themes]"
                }
            },
            "emotion_radar": {
                "confidence": "[0-100 integer]",
                "empathy": "[0-100 integer]",
                "authority": "[0-100 integer]",
                "composure": "[0-100 integer]",
                "enthusiasm": "[0-100 integer]",
                "trust": "[0-100 integer]"
            },
            "timeline_analysis": [
                {
                    "timestamp": "[MM:SS]",
                    "event": "[Short title of the event at this timestamp]",
                    "sentiment": "[positive/neutral/negative]",
                    "emotion_label": "[e.g., Confident, Hesitant]",
                    "confidence_score": "[0-100 integer]",
                    "engagement_score": "[0-100 integer]",
                    "insight": "[Observation from the audio at this moment]"
                }
            ],
            "benchmark_comparison": {
                "your_score": "[Same as overall_performance.score]",
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
                    "title": "[Actionable recommendation title]",
                    "rationale": "[Why this matters]",
                    "strategy": "[How to achieve this]",
                    "priority": "[High/Medium/Low]",
                    "timeframe": "[e.g., Immediate, 1-2 weeks]",
                    "expected_impact": "[e.g., Significant, Moderate]"
                }
            ],
            "key_takeaways": [
                "[Highlight 1]",
                "[Highlight 2]",
                "[Highlight 3]"
            ],
            "summary": "WRITE A HIGHLY INSIGHTFUL, ELITE EXECUTIVE COACH'S NOTE HERE based on the audio. Write 2-3 hard-hitting paragraphs analyzing vocal delivery, pacing, and perceived authority. Use professional consulting terminology."
        }
        """

        if self.use_api_key:
            # --- API Key Mode (Local File) ---
            print(f"Uploading audio {audio_path} to Gemini...")
            if not os.path.exists(audio_path):
                raise ValueError(f"Local audio file not found: {audio_path}")

            import mimetypes
            mime_type, _ = mimetypes.guess_type(audio_path)
            if not mime_type:
                mime_type = "audio/mp3" # Safe fallback

            audio_file = genai.upload_file(path=audio_path, mime_type=mime_type)
            
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

    def analyze_full_transcript(self, transcript_text: str, metadata: dict, target_person: str = None) -> dict:
        """
        Analyzes a full video transcript as an alternative to analyzing the raw video file.
        This bypasses the need to download the video, avoiding YouTube bot blocking.
        """
        target_instruction = ""
        if target_person and target_person.lower() != "speaker":
            target_instruction = f"\n\n**CRITICAL REQUIREMENT: IDENTIFY AND ANALYZE THE SPECIFIC PERSON NAMED '{target_person}'.**\nIf multiple people are present, you MUST focus your entire analysis exclusively on '{target_person}'. Do not analyze the interviewer or other participants.\n"

        prompt = f"""
        You are an elite Executive Communication Coach for the AI era. You are analyzing a transcript of an executive's speech or presentation to generate a comprehensive "Executive Dashboard" report.{target_instruction}
        Even though you cannot see the video, evaluate their communication style based on the spoken text, structure, pacing (implied by content), and implicit tone.

        **Objective**: Evaluate the speaker's executive credibility, communication effectiveness, and structure against global C-suite standards based on this transcript.

        **Output**: Return a strict JSON object matching this EXACT schema. YOU MUST REPLACE ALL PLACEHOLDER VALUES WITH YOUR ACTUAL ANALYSIS:
        {{
            "analysis_reliability": {{
                "score": "[0-100 integer]",
                "notice": "Analysis is based on text transcript only. Visual and vocal nuances (like posture and exact tone) are inferred from content structure and language choice."
            }},
            "video_metadata": {{
                "duration": "[Duration if available, else 'Unknown']",
                "published_date": "Unknown",
                "extracted_interviewee_name": "[Identify the main speaker from the text]"
            }},
            "overall_performance": {{
                "score": "[0-100 integer]",
                "level": "[e.g., Excellent, Good, Average, Needs Improvement]",
                "summary": "[Brief 1-sentence summary based on transcript]",
                "badge": "[e.g., Top Performer, Articulate Strategist]"
            }},
            "high_level_metrics": {{
                "confidence": {{"score": "[0-100 integer]", "label": "Confidence"}},
                "trustworthiness": {{"score": "[0-100 integer]", "label": "Trustworthiness"}},
                "engagement": {{"score": "[0-100 integer]", "label": "Engagement"}},
                "clarity": {{"score": "[0-100 integer]", "label": "Clarity"}}
            }},
            "detailed_analysis": {{
                "voice_analysis": {{
                    "speaking_rate": "Not Evaluated",
                    "pause_frequency": "Not Evaluated",
                    "volume_variation": "Not Evaluated",
                    "clarity_rating": "[e.g., Good, Fair, Poor (based on text clarity)]",
                    "observation": "Voice metrics cannot be fully evaluated from transcript alone. Language suggests a [e.g., confident] delivery."
                }},
                "message_analysis": {{
                    "keyword_density": "[e.g., Appropriate, High, Low]",
                    "emotional_tone": "[e.g., Positive, Neutral, Serious, Passionate]",
                    "structure_rating": "[e.g., Logical, Rambling, Structured]",
                    "logic_flow": "[e.g., Well-organized, Hard to follow]",
                    "observation": "[1-sentence observation on structure and themes]"
                }}
            }},
            "emotion_radar": {{
                "confidence": "[0-100 integer]",
                "empathy": "[0-100 integer]",
                "authority": "[0-100 integer]",
                "composure": "[0-100 integer]",
                "enthusiasm": "[0-100 integer]",
                "trust": "[0-100 integer]"
            }},
            "timeline_analysis": [
                {{
                    "timestamp": "[MM:SS]",
                    "event": "[Short title of the event at this timestamp]",
                    "sentiment": "[positive/neutral/negative]",
                    "emotion_label": "[e.g., Confident, Hesitant, Strategic]",
                    "confidence_score": "[0-100 integer]",
                    "engagement_score": "[0-100 integer]",
                    "insight": "[Observation from the transcript at this moment]"
                }}
            ],
            "benchmark_comparison": {{
                "your_score": "[Same as overall_performance.score]",
                "industry_average": 72,
                "top_ceos": 92,
                "metrics": ["Confidence", "Trustworthiness", "Engagement", "Clarity"],
                "emotion_radar_benchmark": {{
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 90,
                    "composure": 85,
                    "enthusiasm": 70,
                    "trust": 85
                }}
            }},
            "recommendations": [
                {{
                    "title": "[Actionable recommendation title]",
                    "rationale": "[Why this matters]",
                    "strategy": "[How to achieve this]",
                    "priority": "[High/Medium/Low]",
                    "timeframe": "[e.g., Immediate, 1-2 weeks]",
                    "expected_impact": "[e.g., Significant, Moderate]"
                }}
            ],
            "key_takeaways": [
                "[Highlight 1]",
                "[Highlight 2]",
                "[Highlight 3]"
            ],
            "summary": "WRITE A HIGHLY INSIGHTFUL, ELITE EXECUTIVE COACH'S NOTE HERE based purely on their word choices and structure. Write 2-3 hard-hitting paragraphs analyzing rhetorical devices, logical flow, and persuasive power. Use professional consulting terminology."
        }}
        
        Analyze the following transcript:
        """ + transcript_text

        if metadata and metadata.get("description"):
            prompt += f"\n\n**Additional Context (Video Description)**:\n{metadata['description']}\n\n*Use the above description to help identify the true name of the speaker if possible.*"

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
