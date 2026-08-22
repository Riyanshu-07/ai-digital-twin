
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_URL or SUPABASE_KEY is missing from .env"
    )

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_avatar_audio(audio_path):

    bucket_name = "avatar-audio"
    file_name = "latest.mp3"

    with open(audio_path, "rb") as audio_file:
        audio_bytes = audio_file.read()

    supabase.storage.from_(bucket_name).upload(
        file_name,
        audio_bytes,
        {
            "content-type": "audio/mpeg",
            "upsert": "true",
        },
    )

    return (
        f"{SUPABASE_URL}/storage/v1/object/public/"
        f"{bucket_name}/{file_name}"
    )

def get_all_memories():

    response = (
        supabase
        .table("memories")
        .select("id, content, category, importance, created_at")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

def search_memories(query_embedding, match_count=5):

    response = supabase.rpc(
        "match_memories",
        {
            "query_embedding": query_embedding,
            "match_count": match_count
        }
    ).execute()

    return response.data


def save_memory(content,category="general",importance=1,embedding=None):
    
    data = {
        "content": content,
        "category": category,
        "importance": importance,
    }

    if embedding is not None:
        data["embedding"] = embedding

    response = (supabase.table("memories").insert(data).execute())

    return response.data

def delete_memory(memory_id):

    response = (
        supabase
        .table("memories")
        .delete()
        .eq("id", memory_id)
        .execute()
    )

    return response.data