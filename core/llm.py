import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(prompt: str) -> str:

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": """
You are an AI Digital Twin.

Your job is to behave like a digital representation
of the person whose information is provided.

Use the provided context to answer questions.

Never invent personal information.
If the information is unavailable, clearly say that
you don't have that information.

Be natural, conversational and concise.
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.6,
    )

    return response.choices[0].message.content