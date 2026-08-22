import asyncio
import re
import edge_tts
import os

VOICE = "en-IN-PrabhatNeural"


def clean_text_for_tts(text: str) -> str:
    """
    Remove Markdown/formatting symbols before sending
    text to the TTS engine.
    """

    # Code blocks
    text = re.sub(r"```[\s\S]*?```", "", text)

    # Inline code
    text = re.sub(r"`([^`]*)`", r"\1", text)

    # Images
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)

    # Markdown links: [text](url) -> text
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)

    # Bold / italic
    text = text.replace("**", "")
    text = text.replace("__", "")
    text = text.replace("*", "")
    text = text.replace("_", " ")

    # Markdown headings
    text = re.sub(r"^\s*#{1,6}\s*", "", text, flags=re.MULTILINE)

    # Bullet points
    text = re.sub(r"^\s*[-•]\s+", "", text, flags=re.MULTILINE)

    # Numbered list formatting
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)

    # Blockquotes
    text = re.sub(r"^\s*>\s*", "", text, flags=re.MULTILINE)

    # Horizontal separators
    text = re.sub(r"^\s*[-*_]{3,}\s*$", "", text, flags=re.MULTILINE)

    # Extra whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()


async def _generate_audio(text: str, output_file: str):

    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE
    )

    await communicate.save(output_file)


def text_to_speech(text: str, output_file: str):

    clean_text = clean_text_for_tts(text)

    if not clean_text:
        return

    asyncio.run(
        _generate_audio(
            clean_text,
            output_file
        )
    )