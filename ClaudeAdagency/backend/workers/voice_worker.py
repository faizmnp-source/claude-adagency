import os
import requests
from workers.celery_app import app
from api.deps import get_supabase

VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_voice(self, project_id: str):
    supabase = get_supabase()

    try:
        supabase.table("jobs").insert({
            "project_id": project_id,
            "type": "voice",
            "status": "running",
            "provider": "elevenlabs",
        }).execute()

        content = supabase.table("content").select("script").eq("project_id", project_id).single().execute().data
        script = content["script"]

        response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers={
                "xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                "Content-Type": "application/json",
            },
            json={
                "text": script,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
            },
            timeout=120,
        )
        response.raise_for_status()

        storage_path = f"voice/{project_id}.mp3"
        supabase.storage.from_("assets").upload(storage_path, response.content)
        voice_url = supabase.storage.from_("assets").get_public_url(storage_path)

        supabase.table("content").update({"voice_url": voice_url}).eq("project_id", project_id).execute()
        supabase.table("jobs").update({"status": "done", "result_url": voice_url}).eq("project_id", project_id).eq("type", "voice").execute()

        from workers.merge_worker import check_and_merge
        check_and_merge.delay(project_id)

    except Exception as exc:
        supabase.table("jobs").update({"status": "failed", "error": str(exc)}).eq("project_id", project_id).eq("type", "voice").execute()
        raise self.retry(exc=exc)
