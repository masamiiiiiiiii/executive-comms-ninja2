from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from services.youtube_service import YouTubeService
from services.gemini_service import GeminiService
from supabase import create_client, Client
import os
import uuid

router = APIRouter()

# Initialize services
# Note: In production, use dependency injection
def get_services():
    bucket_name = os.getenv("GCP_BUCKET_NAME")
    project_id = os.getenv("GCP_PROJECT_ID") # We need to add this to .env
    
    # Debugging: Print CWD and env vars
    print(f"Current Working Directory: {os.getcwd()}")
    
    # Fallback to extracting project_id from service account if not in env
    if not project_id:
        try:
            # Try absolute path first if relative fails, or check common locations
            sa_path = "service_account.json"
            if not os.path.exists(sa_path):
                 print(f"File not found: {sa_path}")
            
            with open(sa_path, "r") as f:
                import json
                sa = json.load(f)
                project_id = sa.get("project_id")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Could not load project_id from service_account.json: {e}")

    if not project_id and not os.getenv("GEMINI_API_KEY") and not os.getenv("gemini_api_key"):
        print("ERROR: Project ID or API Key is missing.")
        raise HTTPException(status_code=500, detail="Configuration Error: Project ID or API Key missing")

    try:
        youtube_service = YouTubeService(bucket_name)
        gemini_service = GeminiService(project_id)
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
             print("ERROR: Supabase credentials missing from environment.")
             raise ValueError("Supabase credentials missing")

        supabase: Client = create_client(supabase_url, supabase_key)
        
        return youtube_service, gemini_service, supabase
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error initializing services: {e}")
        raise HTTPException(status_code=500, detail=f"Service Initialization Error: {e}")

class AnalysisRequest(BaseModel):
    youtube_url: str
    user_id: str
    video_title: str
    company: str
    role: str
    target_person: str
    transcript_text: str = ""
    start_time: Optional[int] = None
    end_time: Optional[int] = None
    lang: Optional[str] = "en"

async def process_analysis(request: AnalysisRequest, analysis_id: str):
    youtube_service, gemini_service, supabase = get_services()
    
    try:
        # 1. Update status to 'processing_download'
        supabase.table("video_analyses").update({"status": "downloading"}).eq("id", analysis_id).execute()
        
        # 2. Extract Transcript and Metadata
        print(f"Extracting transcript & metadata for {request.youtube_url}")
        
        try:
            metadata = youtube_service.get_metadata(request.youtube_url)
        except Exception as e:
            print(f"Metadata extraction warning: {e}")
            metadata = {}
            
        transcript_text = request.transcript_text
        analysis_result = None
        
        if not transcript_text:
            # Fallback to backend extraction if not provided by frontend
            try:
                print(f"Attempting transcript extraction for {request.youtube_url}")
                transcript_text = youtube_service.get_transcript(
                    request.youtube_url, 
                    start_time=request.start_time, 
                    end_time=request.end_time
                )
                
                # 3. Update status to 'analyzing'
                supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
                
                # 4. Analyze with Gemini (Transcript mode)
                print(f"Starting Gemini transcript analysis")
                analysis_result = gemini_service.analyze_full_transcript(transcript_text, metadata, request.target_person, lang=request.lang)
                
            except Exception as e:
                print(f"Transcript extraction failed, falling back to VIDEO analysis: {e}")
                
                # Update status to 'downloading'
                supabase.table("video_analyses").update({"status": "downloading"}).eq("id", analysis_id).execute()
                
                # 1. Download Video (Audio + Vision)
                video_path = youtube_service.download_video(
                    request.youtube_url,
                    start_time=request.start_time,
                    end_time=request.end_time
                )
                
                # 2. Update status to 'analyzing'
                supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
                
                # 3. Run Multimodal Analysis (Includes facial expressions, eye contact)
                print(f"Starting Gemini VIDEO analysis")
                analysis_result = gemini_service.analyze_video(video_path, metadata, request.target_person, lang=request.lang)
                
                # 4. Cleanup temp file
                try:
                    import shutil
                    shutil.rmtree(os.path.dirname(video_path))
                except:
                    pass
        else:
             # Manual transcript provided
             supabase.table("video_analyses").update({"status": "analyzing"}).eq("id", analysis_id).execute()
             analysis_result = gemini_service.analyze_full_transcript(transcript_text, metadata, request.target_person, lang=request.lang)

        # 5. Inject real metadata into results for frontend display
        if metadata and analysis_result:
            if "video_metadata" not in analysis_result:
                analysis_result["video_metadata"] = {}
            
            analysis_result["video_metadata"]["channel_title"] = metadata.get("author")
            analysis_result["video_metadata"]["published_date"] = metadata.get("publish_date")
            analysis_result["video_metadata"]["duration_seconds"] = metadata.get("length")
            
            # Fallback for Target Person Name if AI failed to extract it
            if not analysis_result["video_metadata"].get("extracted_interviewee_name") or analysis_result["video_metadata"].get("extracted_interviewee_name") == "Unknown":
                analysis_result["video_metadata"]["extracted_interviewee_name"] = metadata.get("author")

        # 6. Save results
        supabase.table("video_analyses").update({
            "status": "completed",
            "analysis_results": analysis_result,
        }).eq("id", analysis_id).execute()

        # 7. Increment monthly_usage_count for the user (subscription tier)
        try:
            from datetime import date
            # Fetch current profile
            profile_resp = supabase.table("profiles").select(
                "tier, monthly_usage_count, monthly_period_start"
            ).eq("id", request.user_id).execute()

            if profile_resp.data:
                prof = profile_resp.data[0]
                tier = prof.get("tier", "")
                # Only track for paid tiers
                if tier:
                    today = date.today()
                    period_start = prof.get("monthly_period_start")
                    count = prof.get("monthly_usage_count", 0) or 0

                    # Reset if we're in a new month
                    if period_start:
                        ps = date.fromisoformat(str(period_start))
                        if today.year != ps.year or today.month != ps.month:
                            count = 0
                            supabase.table("profiles").update({
                                "monthly_usage_count": 1,
                                "monthly_period_start": today.replace(day=1).isoformat()
                            }).eq("id", request.user_id).execute()
                        else:
                            supabase.table("profiles").update({
                                "monthly_usage_count": count + 1
                            }).eq("id", request.user_id).execute()
                    else:
                        supabase.table("profiles").update({
                            "monthly_usage_count": 1,
                            "monthly_period_start": today.replace(day=1).isoformat()
                        }).eq("id", request.user_id).execute()
        except Exception as e:
            print(f"Warning: Could not update monthly_usage_count: {e}")

        print(f"Analysis {analysis_id} completed successfully.")
        
    except Exception as e:
        print(f"Analysis {analysis_id} failed: {e}")
        supabase.table("video_analyses").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", analysis_id).execute()

@router.post("/analyze")
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    print(f"DEBUG: Processing analysis request for URL: {request.youtube_url} | User: {request.user_id}")
    youtube_service, gemini_service, supabase = get_services()
    
    # --- DEMO MODE ---
    if request.youtube_url == "DEMO_MODE":
        # Create a mock analysis record
        mock_analysis_id = str(uuid.uuid4())
        mock_results = {
            "analysis_reliability": {
                "score": 98,
                "notice": "High confidence analysis based on legendary Jack Welch interview footage."
            },
            "video_metadata": {
                "duration": "09:12",
                "published_date": "2018-05-15",
                "extracted_interviewee_name": "Jack Welch",
                "channel_title": "Leadership Vault"
            },
            "overall_performance": {
                "score": 96,
                "level": "Legendary",
                "summary": "This is a demonstration of the Executive Comms Ninja analysis using Jack Welch's classic interview footage. The speaker demonstrates unparalleled executive presence characterized by extreme candor, high energy, and absolute conviction. His direct, no-nonsense communication style cuts effortlessly through corporate jargon.",
                "badge": "Master Communicator"
            },
            "high_level_metrics": {
                "confidence": {"score": 98, "label": "Confidence"},
                "trustworthiness": {"score": 90, "label": "Authenticity"},
                "engagement": {"score": 95, "label": "Engagement"},
                "clarity": {"score": 94, "label": "Clarity"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "Energetic Pace",
                    "pause_frequency": "Strategic",
                    "volume_variation": "Highly Dynamic",
                    "clarity_rating": "Excellent",
                    "observation": "Speaker maintained an energetic, staccato rhythm. He frequently leaned in and used volume shifts to passionately emphasize core principles like 'candor' and 'differentiation'."
                },
                "message_analysis": {
                    "keyword_density": "Very High",
                    "emotional_tone": "Assertive",
                    "structure_rating": "Direct",
                    "logic_flow": "Anecdote-driven",
                    "observation": "Utterly void of corporate speak. Messages were delivered with blunt honesty, using personal anecdotes to enforce a strict meritocratic philosophy."
                }
            },
            "emotion_radar": {
                "confidence": 98,
                "empathy": 65,
                "authority": 99,
                "composure": 90,
                "enthusiasm": 96,
                "trust": 88
            },
            "timeline_analysis": [
                {
                    "timestamp": "00:25",
                    "event": "Blunt Assertion",
                    "sentiment": "neutral",
                    "emotion_label": "Authoritative",
                    "confidence_score": 99,
                    "engagement_score": 90,
                    "insight": "Immediately took control of the narrative, establishing dominance with a blunt truth about organizational candor."
                },
                {
                    "timestamp": "02:10",
                    "event": "Passionate Anecdote",
                    "sentiment": "positive",
                    "emotion_label": "Enthusiastic",
                    "confidence_score": 95,
                    "engagement_score": 96,
                    "insight": "Leaned forward, increasing vocal intensity to passionately describe the 20-70-10 differentiation rule."
                },
                {
                    "timestamp": "05:40",
                    "event": "No-Nonsense Rebuttal",
                    "sentiment": "neutral",
                    "emotion_label": "Intense",
                    "confidence_score": 98,
                    "engagement_score": 92,
                    "insight": "Swiftly dismissed a premise in the interviewer's question, cutting straight to the core business reality."
                }
            ],
            "benchmark_comparison": {
                "your_score": 96,
                "industry_average": 74,
                "top_ceos": 91,
                "metrics": ["Confidence", "Authority", "Energy", "Clarity"],
                "emotion_radar_benchmark": {
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 88,
                    "composure": 82,
                    "enthusiasm": 75,
                    "trust": 85
                }
            },
            "recommendations": [
                {
                    "title": "Soften delivery for highly sensitive topics",
                    "rationale": "Extreme candor can sometimes alienate a subset of the modern workforce.",
                    "strategy": "Incorporate a brief empathetic preamble before delivering hard truths to broaden receptivity.",
                    "priority": "Low",
                    "timeframe": "Ongoing",
                    "expected_impact": "5%"
                }
            ],
            "key_takeaways": [
                "Master-class in conveying absolute conviction and authority through visceral, energetic delivery.",
                "Zero reliance on corporate jargon; language was accessible, blunt, and highly memorable.",
                "A vivid demonstration of 'Executive Presence' defined by sheer force of personality rather than polished perfection."
            ],
            "summary": "A masterful display of executive presence and authority. Jack Welch navigated the interview with extreme candor and high energy, translating complex business philosophies into accessible, hard-hitting truths. The primary hallmark of his style is a complete absence of corporate speak, relying instead on pure conviction to command the room."
        }
        
        mock_results_ja = {
            "analysis_reliability": {
                "score": 98,
                "notice": "伝説的なジャック・ウェルチのインタビュー映像に基づく、信頼性の高い分析結果です。"
            },
            "video_metadata": {
                "duration": "09:12",
                "published_date": "2018-05-15",
                "extracted_interviewee_name": "ジャック・ウェルチ",
                "channel_title": "Leadership Vault"
            },
            "overall_performance": {
                "score": 96,
                "level": "レジェンダリー",
                "summary": "ジャック・ウェルチ氏の後生に残る本質的なインタビュー映像を用いたデモンストレーション分析です。極めて高い率直さ、エネルギー、そして絶対的な自信に満ちた、類まれなる究極のリーダーシップ・プレゼンスが示されています。彼の研ぎ澄まされたコミュニケーション・スタイルは、難解なビジネス用語を廃し、物事の本質を的確に突いています。",
                "badge": "マスター・コミュニケーター"
            },
            "high_level_metrics": {
                "confidence": {"score": 98, "label": "自信と確信"},
                "trustworthiness": {"score": 90, "label": "信頼性"},
                "engagement": {"score": 95, "label": "説得力と求心力"},
                "clarity": {"score": 94, "label": "明瞭さ"}
            },
            "detailed_analysis": {
                "voice_analysis": {
                    "speaking_rate": "エネルギッシュなペース",
                    "pause_frequency": "戦略的な間合い",
                    "volume_variation": "極めてダイナミック",
                    "clarity_rating": "優秀",
                    "observation": "歯切れのよいエネルギッシュなリズムを終始維持されています。頻繁に身を乗り出し、声のトーンを巧みに変化させながら、「率直さ」や「差別化」といった核心となる原則を情熱的に強調しています。"
                },
                "message_analysis": {
                    "keyword_density": "非常に高い水準",
                    "emotional_tone": "断定的かつ力強い",
                    "structure_rating": "直線的で直感的",
                    "logic_flow": "エピソードの活用",
                    "observation": "無味乾燥な企業用語が一切排除されています。実績ある哲学を説得力をもって裏付けるため、ご自身のエピソードを交えながら、飾らない生の言葉で率直にメッセージを響かせています。"
                }
            },
            "emotion_radar": {
                "confidence": 98,
                "empathy": 65,
                "authority": 99,
                "composure": 90,
                "enthusiasm": 96,
                "trust": 88
            },
            "timeline_analysis": [
                {
                    "timestamp": "00:25",
                    "event": "率直な主張と主導権の掌握",
                    "sentiment": "neutral",
                    "emotion_label": "権威的",
                    "confidence_score": 99,
                    "engagement_score": 90,
                    "insight": "冒頭から対話の主導権を完全に握り、組織の「率直さ」に関する本質を単刀直入に述べることで、圧倒的な存在感を確立しています。"
                },
                {
                    "timestamp": "02:10",
                    "event": "情熱的な信念の共有",
                    "sentiment": "positive",
                    "emotion_label": "熱狂的",
                    "confidence_score": 95,
                    "engagement_score": 96,
                    "insight": "身を乗り出し、声のトーンを意図的に高めながら「20-70-10の法則（組織の差別化）」について聞き手の心に訴えかけるように情熱的に語っています。"
                },
                {
                    "timestamp": "05:40",
                    "event": "断固たる反論と方向転換",
                    "sentiment": "neutral",
                    "emotion_label": "理性的かつ情熱的",
                    "confidence_score": 98,
                    "engagement_score": 92,
                    "insight": "インタビュアーの質問に含まれた誤った前提を即座に退け、ビジネスの厳しい現実という本質的な議論へと鋭く切り込んでいます。"
                }
            ],
            "benchmark_comparison": {
                "your_score": 96,
                "industry_average": 74,
                "top_ceos": 91,
                "metrics": ["自信", "権威と影響力", "熱量", "メッセージの明瞭さ"],
                "emotion_radar_benchmark": {
                    "confidence": 85,
                    "empathy": 80,
                    "authority": 88,
                    "composure": 82,
                    "enthusiasm": 75,
                    "trust": 85
                }
            },
            "recommendations": [
                {
                    "title": "センシティブな話題における表現の緩和",
                    "rationale": "極端な率直さは推進力を生む一方で、一部の現代の従業員層や若手社員に警戒心を抱かせるリスクを孕んでいます。",
                    "strategy": "厳しい事実や評価を伝える直前に、相手の労をねぎらう短い共感の言葉（ワンクッション）を添えることで、心理的安全性と傾聴姿勢を引き出しやすくなります。",
                    "priority": "Low",
                    "timeframe": "継続的",
                    "expected_impact": "5%"
                }
            ],
            "key_takeaways": [
                "内側から滲み出る圧倒的なエネルギーにより、絶対的な確信と権威の強さを体現する、マスタークラスのプレゼンスです。",
                "組織特有の「コーポレート・スピーク（空虚な企業用語）」に一切依存せず、誰もが直感的に理解できる生の言葉選びが記憶に深く残ります。",
                "計算された完璧さではなく、個人の強烈なカリスマ性と揺るぎない信念によって構成される本物の「エグゼクティブ・プレゼンス」を見事に実証しています。"
            ],
            "summary": "経営層の在り方として見事な権威的プレゼンスを示しています。ジャック・ウェルチ氏は極めて率直かつエネルギーに満ちた姿勢でインタビューを牽引し、複雑な経営哲学を万人に響く力強い真理へと昇華させました。最大の特徴は、洗練されたコーポレート・スピークの完全な排除にあります。代わりに、純粋な信念とエネルギーによってその場を掌握するアプローチは、真のリーダーシップとは何かを我々に明白に示しています。"
        }
        final_mock_results = mock_results_ja if request.lang and request.lang.startswith("ja") else mock_results
        
        try:
            supabase.table("video_analyses").insert({
                "id": mock_analysis_id,
                "user_id": request.user_id,
                "youtube_url": "https://www.youtube.com/watch?v=VM0AU-vPNeQ", # Real video for demo player seeking
                "status": "completed",
                "video_title": request.video_title,
                "target_person": request.target_person,
                "role": request.role,
                "company": request.company,
                "analysis_results": final_mock_results
            }).execute()
            
            return {"status": "completed", "analysis_id": mock_analysis_id}
            
        except Exception as e:
             import traceback
             traceback.print_exc()
             print(f"DEMO MODE ERROR: {e}")
             raise HTTPException(status_code=500, detail=f"Demo mode failed: {str(e)}")
    # --- END DEMO MODE ---

    try:
        # 1. Create a record in Supabase immediately
        data = {
            "user_id": request.user_id,
            "youtube_url": request.youtube_url,
            "video_title": request.video_title,
            "company": request.company,
            "role": request.role,
            "target_person": request.target_person,
            "status": "pending"
        }
        
        response = supabase.table("video_analyses").insert(data).execute()
        analysis_id = response.data[0]['id']
        
        # 2. Start background task
        background_tasks.add_task(process_analysis, request, analysis_id)
        
        return {"status": "queued", "analysis_id": analysis_id}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        # If analysis_id was created but task failed to schedule (unlikely), we still return success-ish
        # But if creation failed, we raise 500
        if 'analysis_id' in locals():
             return {"status": "queued", "analysis_id": analysis_id}
        raise HTTPException(status_code=500, detail=f"Failed to start analysis: {str(e)}")

@router.get("/analyze/{analysis_id}")
async def get_analysis(analysis_id: str):
    youtube_service, gemini_service, supabase = get_services()
    
    try:
        response = supabase.table("video_analyses").select("*").eq("id", analysis_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
