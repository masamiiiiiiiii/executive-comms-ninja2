import os
import glob
from PIL import Image, ImageDraw, ImageFont
from moviepy.editor import ImageClip, AudioFileClip, CompositeVideoClip

# 1. Find the base image
base_images = glob.glob('/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/interview_scene_*.png')
if not base_images:
    raise RuntimeError("Base image not found")
base_image_path = base_images[0]

# 2. Process image (crop to 16:9, dim slightly for text)
img = Image.open(base_image_path).convert("RGBA")
W, H = img.size
target_h = int(W * 9 / 16)
top = (H - target_h) // 2
bottom = top + target_h
img_cropped = img.crop((0, top, W, bottom))

# Add a slight dark overlay so text pops out (elegant navy blue)
overlay = Image.new('RGBA', img_cropped.size, (10, 20, 40, 110))
img_cropped = Image.alpha_composite(img_cropped, overlay)
img_cropped = img_cropped.convert("RGB")
img_cropped_path = "base_16_9.jpg"
img_cropped.save(img_cropped_path)

# 3. Create text overlays using Pillow
def create_text_image(text, size=(W, target_h), font_size=80, y_pos=None):
    txt_img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_img)
    
    font_paths = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/AppleGothic.ttf"
    ]
    font = None
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except Exception:
                pass
    if font is None:
        font = ImageFont.load_default()
        
    try:
        # Pillow fallback box calculation
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
    except Exception:
        # ancient pillow
        w, h = draw.textsize(text, font=font)
        
    if y_pos is None:
        y_pos = (size[1] - h) // 2
        
    x = (size[0] - w) // 2
    
    # Draw drop shadow for elegance
    draw.text((x+2, y_pos+2), text, font=font, fill=(0, 0, 0, 150))
    # Draw main text, very clean white
    draw.text((x, y_pos), text, font=font, fill=(255, 255, 255, 255))
    
    path = f"tmp_text_{hash(text)}.png"
    txt_img.save(path)
    return path

txt1_path = create_text_image("「直感ではなく、データで」", font_size=int(target_h*0.07), y_pos=int(target_h*0.35))
txt2_path = create_text_image("インタビュー分析がさらに簡単に", font_size=int(target_h*0.09), y_pos=int(target_h*0.50))

# 4. Assemble video with MoviePy
W_video, H_video = img_cropped.size
duration = 6.0

# Base clip
base_clip = ImageClip(img_cropped_path).set_duration(duration)

# Text 1 clip: Fades in at 1s, stays
t1_clip = ImageClip(txt1_path).set_duration(duration - 1.0).set_start(1.0).crossfadein(1.0)
# Text 2 clip: Fades in at 3s, stays
t2_clip = ImageClip(txt2_path).set_duration(duration - 2.5).set_start(2.5).crossfadein(1.0)

video = CompositeVideoClip([base_clip, t1_clip, t2_clip], size=(W_video, H_video))

# Add audio
try:
    audio = AudioFileClip("bgm.webm")
    # Trim audio to 6s
    if audio.duration > duration:
        audio = audio.subclip(0, duration)
    # Audio fade out
    audio = audio.audio_fadeout(2.0)
    video = video.set_audio(audio)
except Exception as e:
    print(f"Warning: Audio processing failed: {e}")

out_path = '/Users/mkito/.gemini/antigravity/brain/60f0199a-ebfe-4cb9-809b-123edc00cfff/final_post.mp4'
video.write_videofile(out_path, fps=24, codec='libx264', audio_codec='aac')
print("Successfully wrote video to", out_path)
