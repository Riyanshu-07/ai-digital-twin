import json

from core.llm import client


def extract_memory(user_message: str):
    prompt = f"""
Analyze the user's message and determine whether it contains information
that should be remembered for future conversations.

USER MESSAGE:
{user_message}

REMEMBER:
- Career goals and aspirations
- Current or long-term projects
- Technical skills and technologies
- Stable preferences
- Long-term interests
- Important plans
- Stable personal information
- Important facts that can improve future personalization

DO NOT REMEMBER:
- Greetings or casual conversation
- Temporary situations
- One-time requests
- Random opinions with no future usefulness
- Questions where the user is only asking for information
- Sensitive information unless the user explicitly asks AETHER to remember it

MEMORY RULES:
- Save only information that is likely to remain useful in future conversations.
- Write the memory as a concise factual statement.
- Do not copy the user's entire message.
- Do not invent or infer information that the user did not explicitly provide.
- If multiple useful facts exist, combine them into one concise memory when possible.
- Importance must be an integer from 1 to 5:
  1 = low importance
  2 = mildly useful
  3 = useful
  4 = important
  5 = highly important / long-term

Return ONLY valid JSON.
Do not include markdown, explanations, or code fences.

If the message contains useful information:
{{
    "should_remember": true,
    "content": "concise factual statement",
    "category": "career/project/skill/preference/goal/personal/general",
    "importance": 1
}}

If the message should not be remembered:
{{
    "should_remember": false
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are AETHER's memory extraction system. "
                    "Your job is to identify useful long-term information "
                    "from user messages. Return only valid JSON."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
        max_tokens=200,
        response_format={"type": "json_object"},
    )

    result = response.choices[0].message.content.strip()

    try:
        memory = json.loads(result)

        if not memory.get("should_remember", False):
            return {"should_remember": False}

        return {
            "should_remember": True,
            "content": memory.get("content", "").strip(),
            "category": memory.get("category", "general"),
            "importance": max(1, min(5, int(memory.get("importance", 3)))),
        }

    except (json.JSONDecodeError, ValueError, TypeError):
        return {"should_remember": False}