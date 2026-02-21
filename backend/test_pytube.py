from pytubefix import YouTube
yt = YouTube('https://www.youtube.com/watch?v=E7wUGafs0LY', client='ANDROID')
print(yt.title)
try:
    captions = yt.captions
    print(captions)
    if 'a.en' in captions:
        print("Found a.en")
        print(captions['a.en'].generate_srt_captions()[:100])
except Exception as e:
    print(f"Error: {e}")
