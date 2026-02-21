from youtube_transcript_api import YouTubeTranscriptApi

try:
    transcript = YouTubeTranscriptApi.get_transcript("E7wUGafs0LY")
    for tr in transcript[:2]:
        print(tr)
except Exception as e:
    print("Error:", repr(e))
