import os
import faiss
import pickle

from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILE_PATH = os.path.join(BASE_DIR, "data", "profile.txt")
INDEX_PATH = os.path.join(BASE_DIR, "data", "index.faiss")
CHUNKS_PATH = os.path.join(BASE_DIR, "data", "chunks.pkl")

# embeding models
model = SentenceTransformer("all-MiniLM-L6-v2")

def load_profile():
    with open(PROFILE_PATH, "r", encoding="utf-8") as file:
        profile = file.read()
    return profile

def create_chunks(text, chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def build_index():
    print(" Loading Profile... ")
    profile = load_profile()
    chunks = create_chunks(profile)
    print(f"Created {len(chunks)} chunks.")
    print("Create embeddings...")
    embeddings = model.encode(
        chunks,convert_to_numpy=True
    )
    dimension = embeddings.shape[1]
    index =faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    faiss.write_index(index, INDEX_PATH)

    with open(CHUNKS_PATH, "wb") as file:
        pickle.dump(chunks, file)

    print("RAG index created successfully!")
    print(f"Index: {INDEX_PATH}")
    print(f"Chunks: {CHUNKS_PATH}")


if __name__ == "__main__":
    build_index()