from moviepy.editor import VideoFileClip
import speech_recognition as sr

# Extract audio to wav
clip = VideoFileClip('../../marketing_assets/Image/ECN VIDEO 1 Final.mp4')
clip.audio.write_audiofile('original.wav', logger=None)

r = sr.Recognizer()
with sr.AudioFile('original.wav') as source:
    audio = r.record(source)
    try:
        print('TRANSCRIPT:', r.recognize_google(audio))
    except sr.UnknownValueError:
        print('TRANSCRIPT: [Google Speech Recognition could not understand audio]')
    except sr.RequestError as e:
        print('TRANSCRIPT: [Could not request results; {0}]'.format(e))
