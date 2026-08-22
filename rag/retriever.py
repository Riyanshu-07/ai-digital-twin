import os
import pickle

import faiss
from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INDEX_PATH = os.path.join(BASE_DIR, "data", "index.faiss")
CHUNKS_PATH = os.path.join(BASE_DIR, "data", "chunks.pkl")


model = SentenceTransformer("all-MiniLM-L6-v2")


def load_index():

    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError(
            "FAISS index not found. Run: python rag/ingest.py"
        )

    return faiss.read_index(INDEX_PATH)


def load_chunks():

    if not os.path.exists(CHUNKS_PATH):
        raise FileNotFoundError(
            "Chunks file not found. Run: python rag/ingest.py"
        )

    with open(CHUNKS_PATH, "rb") as file:
        return pickle.load(file)


def retrieve(query, top_k=3):

    index = load_index()
    chunks = load_chunks()

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    )

    distances, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for index_id in indices[0]:

        if index_id < len(chunks):
            results.append(chunks[index_id])

    return results


def get_context(query, top_k=3):

    results = retrieve(query, top_k)

    if not results:
        return "No relevant information found."

    return "\n\n".join(results)