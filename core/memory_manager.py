from core.memory_extractor import extract_memory
from core.embeddings import create_embedding
from core.memory_store import save_memory


def process_memory(user_message: str):

    memory = extract_memory(user_message)

    if not memory.get("should_remember", False):
        return None

    content = memory.get("content")

    if not content:
        return None

    category = memory.get("category", "general")
    importance = memory.get("importance", 1)

    embedding = create_embedding(content)

    saved = save_memory(
        content=content,
        category=category,
        importance=importance,
        embedding=embedding
    )

    return saved