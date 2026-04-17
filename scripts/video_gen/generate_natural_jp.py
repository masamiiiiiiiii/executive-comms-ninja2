import os
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

# 1. We assume demucs/karaoke has run and 'no_vocals.wav' exists.
bgm_path = 'no_vocals.wav'
if not os.path.exists(bgm_path):
    print("Demucs output not found:", bgm_path)
    exit(1)

# 2. Generate edge-tts
# Male voice
os.system(f'python run_edge_tts_unverified.py --voice ja-JP-KeitaNeural --text "単なる文字起こしではありません。" --write-media male_jp.mp3')
# Female voice
os.system(f'python run_edge_tts_unverified.py --voice ja-JP-NanamiNeural --text "その背後にある文脈が重要なのです。" --write-media female_jp.mp3')

video = VideoFileClip('../../marketing_assets/Image/ECN VIDEO 1 Final.mp4')
duration = video.duration

bgm_clip = AudioFileClip(bgm_path)
male_clip = AudioFileClip('male_jp.mp3').set_start(0.5) # start around 0.5s
female_clip = AudioFileClip('female_jp.mp3').set_start(3.5) # start around 3.5s

# Reduce BGM volume a bit so voices are clear
bgm_clip = bgm_clip.volumex(0.6)
# Increase voices
male_clip = male_clip.volumex(1.5)
female_clip = female_clip.volumex(1.5)

final_audio = CompositeAudioClip([bgm_clip, male_clip, female_clip])
final_audio = final_audio.subclip(0, duration)

video = video.set_audio(final_audio)

out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/ECN_VIDEO_1_JP_Natural.mp4'
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated natural voice video to", out_path)
