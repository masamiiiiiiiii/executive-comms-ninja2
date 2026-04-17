import os
import sys
import time
import google.genai as genai
from google.genai import types
from dotenv import load_dotenv

# Load API key from backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in backend/.env")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def generate_branded_video(output_mp4_path):
    print("Starting Veo 3.0 Video Generation...")
    
    # ---------------------------------------------------------
    # 🎬 VEO PROMPT (Tuned to VISUAL_BRAND_GUIDELINES.md)
    # ---------------------------------------------------------
    # Core Brand: Minimalist, Pale Green (#899B87), Warm Cream (#F6F3EC)
    # Style: Sophisticated business magazine, highly elegant, no harsh blacks.
    
    brand_prompt = (
        "A highly elegant, cinematic live-action shot of a sophisticated Japanese male executive "
        "standing confidently in a minimalist, modern boardroom. "
        "The lighting revolves around a muted, elegant palette of pale sage green and warm creamy beige. "
        "No harsh blacks or bright primary colors; everything is soft, low-contrast, and pastel-toned, "
        "resembling the aesthetic of a high-end editorial business magazine like Monocle. "
        "Subtle, clean digital data visualizations (thin sage green lines) float gently in the negative space. "
        "The camera pushes in very slowly. 4k, hyper-realistic, highly detailed, soft cinematic lighting."
    )
    
    print(f"\nPrompt: {brand_prompt}\n")
    print("Calling Veo 3.0 API (this can take several minutes)...")
    
    try:
        # Note: Depending on the specific Veo model version available to your key, 
        # the generate_videos method is used for asynchronous video generation.
        # We will use the veo-2.0-generate-001 model as a stable fallback, or veo-3.0 if available.
        # Check client.models.list() if you want to experiment with other Veo endpoints.
        
        operation = client.models.generate_videos(
            model='veo-2.0-generate-001',
            prompt=brand_prompt,
            config=types.GenerateVideosConfig(
                number_of_videos=1,
                aspect_ratio="16:9",
                person_generation="ALLOW_ADULT"
            )
        )
        
        print("Video generation started. Waiting for completion...")
        
        # In the new genai SDK, we just wait for the video to be ready or use operation string.
        # But we actually just need to dump operation to see its structure.
        print(f"Operation ID/Object: {operation}")
        
        # Poll the operation status
        while True:
            op = client.operations.get(operation=operation)
            if getattr(op, "done", False):
                operation = op
                break
            print(".", end="", flush=True)
            time.sleep(10)
            
        print("\nGeneration complete!")
        
        if operation.error:
            print(f"Error generating video: {operation.error}")
            sys.exit(1)
            
        # The operation result contains the generated videos
        print(f"Operation Result: {operation.result}")
        if not operation.result:
             print("Operation has no result.")
             sys.exit(1)
             
        videos = operation.result.generated_videos
        if not videos:
            print("No video returned inside result.")
            sys.exit(1)
            
        video = videos[0].video
        print(f"Video object: {video}")
        video_bytes = getattr(video, "video_bytes", getattr(video, "bytes", None))
        
        if not video_bytes:
            print("Video bytes were missing. Result details:")
            print(dir(video))
            sys.exit(1)
        
        with open(output_mp4_path, "wb") as f:
            f.write(video_bytes)
            
        print(f"✅ Successfully saved branded video to: {output_mp4_path}")
        
    except Exception as e:
        print(f"\nAPI Error: {e}")
        print("Note: If you receive a 404 or permission error, it means Veo generation is not yet enabled for your specific Google AI Studio project/key tier.")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.dirname(__file__))
    assets_dir = os.path.join(script_dir, "marketing_assets", "Image")
    output_path = os.path.join(assets_dir, "ECN_VEO_BRANDED.mp4")
    
    generate_branded_video(output_path)
