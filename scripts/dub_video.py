import os
import sys
import subprocess
from openai import OpenAI
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", ".env")
load_dotenv(env_path)

def create_voiceover(text, output_audio_path):
    print("Initializing OpenAI TTS Client...")
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set in backend/.env")
        sys.exit(1)
        
    client = OpenAI(api_key=api_key)

    print(f"Generating audio for text: '{text[:30]}...'")
    response = client.audio.speech.create(
        model="tts-1",
        voice="onyx", # deep male voice
        input=text
    )

    response.stream_to_file(output_audio_path)
    print(f"Audio content written to file '{output_audio_path}'")

def merge_audio_video(video_path, audio_path, output_video_path):
    print("Merging generated audio with the original video using ffmpeg...")
    
    # ffmpeg command to replace the audio track
    # -i video -i audio -c:v copy (copy video directly) -c:a aac (encode audio) -map 0:v:0 (video from input 0) -map 1:a:0 (audio from input 1)
    
    ffmpeg_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tools", "ffmpeg")
    command = [
        ffmpeg_path,
        "-y", # Overwrite output if exists
        "-i", video_path,
        "-i", audio_path,
        "-c:v", "copy",
        "-c:a", "aac",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-shortest", # Finish encoding when the shortest input stream ends
        output_video_path
    ]
    
    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Successfully created dubbed video: {output_video_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error merging video: {e.stderr.decode('utf-8')}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python dub_video.py <input_video_path>")
        sys.exit(1)
        
    input_video = sys.argv[1]
    
    script_dir = os.path.dirname(os.path.dirname(__file__))
    assets_dir = os.path.join(script_dir, "marketing_assets", "Image")
    
    output_audio = os.path.join(assets_dir, "japanese_voiceover.mp3")
    output_video = os.path.join(assets_dir, "ECN_VIDEO_1_Japanese.mp4")
    
    # The refined, edgy Japanese text
    japanese_text = "では、このデータをどう読み解くべきか。重要なのは表面的な発言ではありません。その背後に潜む、真意なのです。"
    
    create_voiceover(japanese_text, output_audio)
    merge_audio_video(input_video, output_audio, output_video)
