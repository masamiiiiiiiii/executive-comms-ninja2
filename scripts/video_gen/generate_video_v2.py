import os
import glob
from PIL import Image, ImageDraw, ImageFont
import PIL
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = getattr(PIL.Image, "LANCZOS", 1) # Pillow fallback
from moviepy.editor import ImageClip, AudioFileClip, CompositeVideoClip

base_images = glob.glob('/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/interview_scene_*.png')
base_image_path = base_images[0]

img = Image.open(base_image_path).convert("RGBA")
W, H = img.size
target_h = int(W * 9 / 16)
top = (H - target_h) // 2
bottom = top + target_h
img_cropped = img.crop((0, top, W, bottom))

# Brand Guidelines: Soft muted olive green HEX #899B87 (137, 155, 135) or Dark Charcoal #5B665A (91, 102, 90)
# Use dark greenish/charcoal tint instead of navy blue
overlay = Image.new('RGBA', img_cropped.size, (91, 102, 90, 110))
img_cropped = Image.alpha_composite(img_cropped, overlay)
img_cropped = img_cropped.convert("RGB")
img_cropped_path = "base_16_9_v2.jpg"
img_cropped.save(img_cropped_path)

def create_text_image(text, size=(W, target_h), font_size=80, y_pos=None):
    txt_img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_img)
    font_paths = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc"
    ]
    font = ImageFont.load_default()
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except Exception:
                pass
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]; h = bbox[3] - bbox[1]
    except Exception:
        w, h = draw.textsize(text, font=font)
    if y_pos is None: y_pos = (size[1] - h) // 2
    x = (size[0] - w) // 2
    # Shadow
    draw.text((x+2, y_pos+2), text, font=font, fill=(50, 60, 50, 150))
    draw.text((x, y_pos), text, font=font, fill=(246, 243, 236, 255)) # F6F3EC
    path = f"tmp_text_{hash(text)}.png"
    txt_img.save(path)
    return path

txt1_path = create_text_image("「直感ではなく、データで」", font_size=int(target_h*0.07), y_pos=int(target_h*0.35))
txt2_path = create_text_image("インタビュー分析がさらに簡単に", font_size=int(target_h*0.09), y_pos=int(target_h*0.50))

duration = 6.0

# Add zoom effect (animation motion)
# Resize linearly from 1.0 to 1.1x over 6s
W_video, H_video = img_cropped.size
def rescale(t):
    return 1.0 + 0.02 * t

base_clip = ImageClip(img_cropped_path).set_duration(duration).resize(rescale)
# Force crop to original size so it zooms into center
base_clip = base_clip.crop(x_center=W_video/2, y_center=H_video/2, width=W_video, height=H_video)

t1_clip = ImageClip(txt1_path).set_duration(duration - 1.0).set_start(1.0).crossfadein(1.0)
t2_clip = ImageClip(txt2_path).set_duration(duration - 2.5).set_start(2.5).crossfadein(1.0)
video = CompositeVideoClip([base_clip, t1_clip, t2_clip], size=(W_video, H_video))

try:
    # Fix BGM. If it has silence at beginning, subclip from 1s maybe
    audio = AudioFileClip("bgm.webm")
    # A lot of these tracks fade in. We will subclip from 2.0s to ensure we get music right away
    if audio.duration > (duration + 2.0):
        audio = audio.subclip(2.0, 2.0 + duration)
    else:
        audio = audio.subclip(0, duration)
    audio = audio.audio_fadeout(1.5)
    video = video.set_audio(audio)
except Exception as e:
    print(f"Warning: Audio processing failed: {e}")

out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/final_post_v2.mp4'
video.write_videofile(out_path, fps=24, codec='libx264', audio_codec='aac')
print("Successfully wrote video 2 to", out_path)
