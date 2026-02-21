import yt_dlp
import os

ydl_opts = {
    'quiet': True,
    'skip_download': True,
    'writesubtitles': True,
    'writeautomaticsub': True,
    'subtitleslangs': ['en*', 'ja*'],
    'outtmpl': 'temp_sub',
    'cookiefile': 'backend/cookies.txt'
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=E7wUGafs0LY'])
    
import glob
files = glob.glob('temp_sub.*')
print("Downloaded files:", files)
