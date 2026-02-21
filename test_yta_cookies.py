from youtube_transcript_api import YouTubeTranscriptApi

try:
    transcript = YouTubeTranscriptApi.get_transcript("E7wUGafs0LY", cookies="backend/cookies.txt")
    print(transcript[:2])
except Exception as e:
    print("Error:", repr(e))
