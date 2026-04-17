import os
import sys
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

try:
    from google.cloud import texttospeech
except ImportError:
    print("Please install google-cloud-texttospeech")
    sys.exit(1)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/mkito/Desktop/Antigravity/executive-comms-ninja/backend/service_account.json'

female_text = "ただの台本読みではないんですよね？"

print("Generating GCP TTS for female voice (ja-JP-Neural2-B)...")
try:
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=female_text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="ja-JP",
        name="ja-JP-Neural2-B" # natural female voice
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.1
    )
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    with open("female_jp_gcp.mp3", "wb") as out:
        out.write(response.audio_content)
except Exception as e:
    print("Error with GCP TTS:", e)
    sys.exit(1)

print("Loading video...")
video = VideoFileClip('/Users/mkito/Desktop/ECN_VIDEO_1_JP_Final_Updated.mp4')
duration = video.duration  # ~8.0 seconds

try:
    female_clip = AudioFileClip('female_jp_gcp.mp3')
    # Reuse the previously generated KeitaNeural male voice because it's good
    male_clip = AudioFileClip('male_jp.mp3')
except Exception as e:
    print("Error loading TTS", e)
    sys.exit(1)

print("Loading BGM...")
bgm_clip = AudioFileClip('w_hotel_jazz.mp3')
bgm_clip = bgm_clip.subclip(15.0, 15.0 + duration).audio_fadeout(1.5).volumex(0.35)

# Sync dialog
female_clip = female_clip.set_start(0.5).volumex(1.8)
male_clip = male_clip.set_start(3.2).volumex(1.8)

print("Compositing audio...")
final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/Desktop/ECN_VIDEO_1_JP_WHotel_Final_GCP.mp4'
print(f"Writing final video to {out_path} ...")
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated final synced video to", out_path)
