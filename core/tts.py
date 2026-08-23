import asyncio
import re
import threading
import edge_tts

VOICE = "en-IN-NeerjaNeural"


def clean_text_for_tts(text: str) -> str:
    """Clean Markdown/formatting before TTS."""

    text = re.sub(r"```[\s\S]*?```", "", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)

    text = text.replace("**", "")
    text = text.replace("__", "")
    text = text.replace("*", "")
    text = text.replace("_", " ")

    text = re.sub(r"^\s*#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-•]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*>\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*_]{3,}\s*$", "", text, flags=re.MULTILINE)

    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()


async def _generate_audio(text: str, output_file: str) -> None:
    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
    )

    await communicate.save(output_file)

def text_to_speech(text: str, output_file: str) -> None:

    if not text:
        print("TTS skipped: empty response")
        return

    if not isinstance(text, str):
        text = str(text)

    clean_text = clean_text_for_tts(text)

    if not clean_text:
        print("TTS skipped: no text after cleaning")
        return

    error = None

    def run_tts():
        nonlocal error

        try:
            asyncio.run(
                _generate_audio(clean_text, output_file)
            )
        except Exception as e:
            error = e

    thread = threading.Thread(target=run_tts)
    thread.start()
    thread.join()

    if error:
        raise RuntimeError(f"TTS generation failed: {error}")