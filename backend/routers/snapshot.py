from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dependencies import get_services
import base64

router = APIRouter()

class SnapshotRequest(BaseModel):
    image_data: str
    video_url: str
    timestamp: float
    title: str = ""

@router.post("/analyze/snapshot")
async def analyze_snapshot(request: SnapshotRequest):
    # Only need gemini service here, really.
    youtube_service, gemini_service, supabase = get_services()
    
    try:
        # Decode base64 image
        if "," in request.image_data:
            header, encoded = request.image_data.split(",", 1)
        else:
            encoded = request.image_data
            
        # Ensure correct padding if needed (though browser usually sends correct b64)
        image_bytes = base64.b64decode(encoded)
        
        # Analyze with Gemini
        print(f"Analyzing snapshot for {request.video_url} at {request.timestamp}")
        result = gemini_service.analyze_snapshot(image_bytes)
        
        # Optionally, save this snapshot result to Supabase if we want a history
        # (For now, let's keep it ephemeral for speed)
        

        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class AudioRequest(BaseModel):
    audio_data: str
    timestamp: float

@router.post("/analyze/audio_chunk")
async def analyze_audio_chunk(request: AudioRequest):
    youtube_service, gemini_service, supabase = get_services()
    try:
        if "," in request.audio_data:
            header, encoded = request.audio_data.split(",", 1)
        else:
            encoded = request.audio_data
            
        audio_bytes = base64.b64decode(encoded)
        
        # Analyze with Gemini (Voice)
        # We need to implement analyze_audio in GeminiService
        result = gemini_service.analyze_audio(audio_bytes)
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        # Return harmless error to not break frontend loop

        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class TranscriptRequest(BaseModel):
    text: str

@router.post("/analyze/transcript")
async def analyze_transcript(request: TranscriptRequest):
    youtube_service, gemini_service, supabase = get_services()
    try:
        # Analyze with Gemini (Text)
        result = gemini_service.analyze_transcript(request.text)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e), "score": 0, "feedback": "Text analysis error"}
