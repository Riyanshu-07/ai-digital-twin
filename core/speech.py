from faster_whisper import WhisperModel

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

def speech_to_text(audio_path:str) -> str:

    segments, info = model.transcribe(
        audio_path,
        beam_size=5
    )

    text = " ".join(segment.text for segment in segments)
    return text.strip()