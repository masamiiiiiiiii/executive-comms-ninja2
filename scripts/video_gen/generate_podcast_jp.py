import os
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

# Female first, then Male (NotebookLM podcast conversational style)
female_text = "いやあ、単なる文字起こしでは、ないんですよね。"
male_text = "そうなんです。その背後にある深い文脈こそが、重要になってくるわけですからね。"

# We use the unverified edge-tts wrapper to bypass macOS SSL issues
os.system(f'python run_edge_tts_unverified.py --voice ja-JP-NanamiNeural --rate=+10% --text "{female_text}" --write-media female_jp.mp3')
os.system(f'python run_edge_tts_unverified.py --voice ja-JP-KeitaNeural --rate=+5% --text "{male_text}" --write-media male_jp.mp3')

video = VideoFileClip('../../marketing_assets/Image/ECN VIDEO 1 Final.mp4')
duration = video.duration

bgm_clip = AudioFileClip('new_bgm.webm')
if bgm_clip.duration > duration + 5:
    bgm_clip = bgm_clip.subclip(5.0, duration + 5.0) # skip intro
else:
    bgm_clip = bgm_clip.subclip(0, duration)

bgm_clip = bgm_clip.audio_fadeout(2.0).volumex(0.25)

# Sync with the 8.0s video animation
female_clip = AudioFileClip('female_jp.mp3')
male_clip = AudioFileClip('male_jp.mp3')

# Animation sync: first part around 0.5s, second part around 3.8s
female_clip = female_clip.set_start(0.5).volumex(1.8)
male_clip = male_clip.set_start(3.5).volumex(1.6)

final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/ECN_VIDEO_1_JP_Podcast.mp4'
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated podcast style video to", out_path)
