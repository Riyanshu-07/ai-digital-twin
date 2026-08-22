class ConversationMemory:

    def __init__(self, max_messages=10):
        self.messages = []
        self.max_messages = max_messages

    def add_message(self, role, content):
        self.messages.append({
            "role": role,
            "content": content
        })

        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages:]

    def get_context(self):
        if not self.messages:
            return ""

        return "\n".join(
            f"{message['role'].upper()}: {message['content']}"
            for message in self.messages
        )

    def clear(self):
        self.messages = []