import os
import sys
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

# Female: Kyoko
# Add a slight pause (comma) and conversational tone
female_text = "ただの、台本読みでは、ないんですよね？"
male_text = "大事なのは、その裏にある『文脈』なんですよね。"

# Generate TTS
cmd_f = f"say -v Kyoko -r 160 '{female_text}' -o female_jp_w.aiff"

print("Generating TTS...")
os.system(cmd_f)

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

print("Loading BGM...")
try:
    bgm_clip = AudioFileClip('w_hotel_jazz.mp3')
except Exception:
    bgm_clip = AudioFileClip('w_hotel_jazz.webm')

bgm_clip = bgm_clip.subclip(15.0, 15.0 + duration).audio_fadeout(1.5).volumex(0.35)

# Sync dialog
# Make the gap between phrases feel slightly more conversational
female_clip = female_clip.set_start(0.5).volumex(1.8)
male_clip = male_clip.set_start(3.5).volumex(2.0) # slightly longer pause before male speaks

print("Compositing audio...")
final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/Desktop/ECN_VIDEO_1_JP_WHotel_Final.mp4'
print(f"Writing final video to {out_path} ...")
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated final synced video to", out_path)
