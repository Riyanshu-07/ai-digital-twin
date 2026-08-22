import json

from core.llm import client


def extract_memory(user_message: str):

    prompt = f"""
Analyze the following user message and determine whether
it contains information worth remembering for future conversations.

USER MESSAGE:
{user_message}

Remember information such as:
- career goals
- projects
- technical skills
- preferences
- important plans
- long-term interests
- stable personal information

Do NOT remember:
- casual conversation
- temporary events
- greetings
- random statements
- information with no future usefulness

Return ONLY valid JSON.

If the message contains useful memory:

{{
    "should_remember": true,
    "content": "concise fact to remember",
    "category": "career/project/skill/preference/goal/personal/general",
    "importance": 1
}}

If it should not be remembered:

{{
    "should_remember": false
}}

USER MESSAGE:
{user_message}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a memory extraction system. Return only valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    result = response.choices[0].message.content.strip()

    try:
        return json.loads(result)

    except json.JSONDecodeError:
        return {
            "should_remember": False
        }