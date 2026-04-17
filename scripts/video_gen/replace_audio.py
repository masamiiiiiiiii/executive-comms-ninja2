from moviepy.editor import VideoFileClip, AudioFileClip

video = VideoFileClip('../../marketing_assets/Image/ECN VIDEO 1 Final.mp4')
# Use the generated JP voiceover
jp_audio = AudioFileClip('jp_voiceover.aiff')

# if JP audio is shorter, it will just end early. If it's longer, maybe crop it.
if jp_audio.duration > video.duration:
    jp_audio = jp_audio.subclip(0, video.duration)

video = video.set_audio(jp_audio)
out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/ECN_VIDEO_1_JP.mp4'
video.write_videofile(out_path, fps=video.fps, codec='libx264', audio_codec='aac')
print("Successfully wrote Japanese audio video to", out_path)
