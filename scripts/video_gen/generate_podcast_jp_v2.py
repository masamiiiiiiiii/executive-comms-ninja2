import os
import sys
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

# 短く、かつポッドキャスト風に自然な相槌っぽく（8秒に確実に収まる文字数に短縮）
# 以前は長すぎて動画の最後（8.0s）で強制カットされていました。
female_text = "ただの台本読みではないんですよね？"
male_text = "大事なのは、その裏にある『文脈』なんですよね。"

# より自然な生身のトーンを模索するため、話すスピードやピッチを微調整します。
cmd_f = f'python run_edge_tts_unverified.py --voice ja-JP-NanamiNeural --rate=+10% --pitch=+5Hz --text "{female_text}" --write-media female_jp.mp3'
cmd_m = f'python run_edge_tts_unverified.py --voice ja-JP-KeitaNeural --rate=+15% --pitch=-2Hz --text "{male_text}" --write-media male_jp.mp3'

os.system(cmd_f)
os.system(cmd_m)

video = VideoFileClip('../../marketing_assets/Image/ECN VIDEO 1 Final.mp4')
duration = video.duration  # 8.0 seconds exact

try:
    female_clip = AudioFileClip('female_jp.mp3')
    male_clip = AudioFileClip('male_jp.mp3')
except Exception as e:
    print("Error loading TTS", e)
    sys.exit(1)

# BGMの処理（すでにダウンロード済みの落ち着いたジャズピアノ 'new_bgm.webm'）
bgm_clip = AudioFileClip('new_bgm.webm')
# BGMのイントロ部分からではなく、曲げ盛り上がっている中盤(10秒〜)を切り出して採用します。
bgm_clip = bgm_clip.subclip(15.0, 15.0 + duration).audio_fadeout(1.5).volumex(0.35)

# タイミング調整：
# 映像のアニメーション（前半・後半）に合わせてセリフを落とし込む
# 女性セリフ：0.5秒から
female_clip = female_clip.set_start(0.5).volumex(2.0)
# 女性セリフが終わるのが約2.5秒。ちょっと間を空けて男性セリフを3.2秒から
male_clip = male_clip.set_start(3.2).volumex(1.8)

# もし男性の音声が動画の後ろにはみ出ても、切れないように確認
end_time = 3.2 + male_clip.duration
print(f"DEBUG: Dialog ends at {end_time}s (Video is {duration}s)")

# Audio Synthesis
final_audio = CompositeAudioClip([bgm_clip, female_clip, male_clip])
# 動画の長さ(8.0s)に合わせて最終音声をカット
final_audio = final_audio.subclip(0, duration)
video = video.set_audio(final_audio)

out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/ECN_VIDEO_1_JP_Final.mp4'
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully generated final synced video to", out_path)
