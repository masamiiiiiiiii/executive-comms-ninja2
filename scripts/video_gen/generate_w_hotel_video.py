import os
import sys
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

# Female: Mayu (natural, broadcast-like)
female_text = "ただの台本読みではないんですよね？"
# Generate TTS
# We use macOS say (Kyoko) for a more natural Japanese female voice, avoiding Edge-TTS SSL issues
cmd_f = f"say -v Kyoko '{female_text}' -o female_jp_w.aiff"

print("Generating TTS...")
os.system(cmd_f)
# We reuse the existing male over voice that the user didn't complain about.

print("Loading video...")
video = VideoFileClip('/Users/mkito/Desktop/ECN_VIDEO_1_JP_Final_Updated.mp4')
duration = video.duration  # ~8.0 seconds

try:
    female_clip = AudioFileClip('female_jp_w.aiff')
    # Reuse the previously generated KeitaNeural male voice because it's good
    male_clip = AudioFileClip('male_jp.mp3')
except Exception as e:
    print("Error loading TTS", e)
    sys.exit(1)

# Load W Hotel NY Jazz BGM
# Often downloaded tracks might have a long intro, let's start at 10.0 seconds to get the feel immediately.
print("Loading BGM...")
try:
    bgm_clip = AudioFileClip('w_hotel_jazz.mp3')
except Exception as e:
    print("Could not load w_hotel_jazz.mp3, trying w_hotel_jazz.webm if ffmpeg extraction failed...", e)
    # in case yt-dlp failed to convert to mp3 due to no ffmpeg
    bgm_clip = AudioFileClip('w_hotel_jazz.webm')

bgm_clip = bgm_clip.subclip(15.0, 15.0 + duration).audio_fadeout(1.5).volumex(0.35)

# Sync dialog
female_clip = female_clip.set_start(0.5).volumex(2.0)
male_clip = male_clip.set_start(3.2).volumex(1.8)

print("Compositing audio...")
final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/Desktop/ECN_VIDEO_1_JP_WHotel_Final.mp4'
print(f"Writing final video to {out_path} ...")
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated final synced video to", out_path)
