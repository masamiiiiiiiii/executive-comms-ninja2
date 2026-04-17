import os
import sys
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
from openai import OpenAI
import httpx

# 1. Generate OpenAI TTS for female voice
# Bypass SSL proxy issues with verify=False
http_client = httpx.Client(verify=False)
client = OpenAI(http_client=http_client) # expects OPENAI_API_KEY in environment

female_text = "ただの台本読みではないんですよね？"

print("Generating OpenAI TTS for female voice (nova)...")
response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input=female_text,
    speed=1.05
)
response.stream_to_file("female_jp_openai.mp3")

print("Loading video...")
video = VideoFileClip('/Users/mkito/Desktop/ECN_VIDEO_1_JP_Final_Updated.mp4')
duration = video.duration  # ~8.0 seconds

try:
    female_clip = AudioFileClip('female_jp_openai.mp3')
    # Reuse the previously generated KeitaNeural male voice
    male_clip = AudioFileClip('male_jp.mp3')
except Exception as e:
    print("Error loading TTS", e)
    sys.exit(1)

print("Loading BGM...")
try:
    bgm_clip = AudioFileClip('w_hotel_jazz.mp3')
except Exception:
    bgm_clip = AudioFileClip('w_hotel_jazz.webm')
bgm_clip = bgm_clip.subclip(15.0, 15.0 + duration).audio_fadeout(1.5).volumex(0.35)

# Sync dialog
female_clip = female_clip.set_start(0.5).volumex(1.8)
male_clip = male_clip.set_start(3.2).volumex(1.8)

print("Compositing audio...")
final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/Desktop/ECN_VIDEO_1_JP_WHotel_Final_OpenAI.mp4'
print(f"Writing final video to {out_path} ...")
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated final synced video to", out_path)
