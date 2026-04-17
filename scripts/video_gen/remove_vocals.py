from pydub import AudioSegment

sound = AudioSegment.from_file("original.wav", format="wav")
left, right = sound.split_to_mono()
vocal_removed = left.overlay(right.invert_phase())

vocal_removed.export("no_vocals.wav", format="wav")
print("Exported no_vocals.wav")
