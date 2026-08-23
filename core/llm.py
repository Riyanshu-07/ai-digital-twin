import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(prompt: str) -> str:

    with open("data/profile.txt", "r", encoding="utf-8") as f:
        person_context = f.read()

    SYSTEM_PROMPT = f"""
You are an AI Digital Twin — a conversational representation of the person
described in the context below.

Rules:
1. Answer only using the given context.
2. Never invent, assume, or guess personal details.
3. If the answer isn't in the context, say so plainly.
4. Keep every response to a maximum of 2 lines (under 40 words).
5. Be direct, factual, and natural.
6. Never invent internships, jobs, certifications, achievements, or experience.

CONTEXT:
{person_context}
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.6,
            reasoning_effort="low",
        )

        result = response.choices[0].message.content

        if not result:
            return "I don't have enough information to answer that."

        return result.strip()

    except Exception as e:
        print(f"LLM generation failed: {e}")
        return "Sorry, I couldn't generate a response right now."