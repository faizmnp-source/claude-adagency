import os
import time
import requests
from workers.celery_app import app
from api.deps import get_supabase

RUNWAY_BASE = "https://api.dev.runwayml.com/v1"
POLL_INTERVAL = 10
POLL_TIMEOUT = 600


def _run(project_id: str):
    """Core logic — callable directly without Celery."""
    supabase = get_supabase()

    supabase.table("jobs").insert({
        "project_id": project_id,
        "type": "video",
        "status": "running",
        "provider": "runway",
    }).execute()

    try:
        runway_key = os.environ.get("RUNWAY_API_KEY", "")
        if not runway_key:
            raise RuntimeError("RUNWAY_API_KEY not set — skipping video generation")

        project = supabase.table("projects").select("image_url, product_name, tone").eq("id", project_id).single().execute().data
        content = supabase.table("content").select("shot_list").eq("project_id", project_id).single().execute().data

        shots = (content.get("shot_list") or [])[:3]
        shot_descriptions = " ".join(s["description"] for s in shots)
        prompt = f"Product showcase for {project['product_name']}. {project['tone']} mood. {shot_descriptions}"

        headers = {
            "Authorization": f"Bearer {runway_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "promptImage": project["image_url"],
            "promptText": prompt,
            "model": "gen4_turbo",
            "duration": 10,
            "ratio": "768:1280",
        }
        res = requests.post(f"{RUNWAY_BASE}/image_to_video", headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        task_id = res.json()["id"]

        supabase.table("jobs").update({"external_id": task_id}).eq("project_id", project_id).eq("type", "video").execute()

        video_url = _poll_runway(task_id, headers)

        storage_path = f"video/{project_id}_raw.mp4"
        video_data = requests.get(video_url, timeout=120).content
        supabase.storage.from_("assets").upload(storage_path, video_data, {"content-type": "video/mp4"})
        stored_url = supabase.storage.from_("assets").get_public_url(storage_path)

        supabase.table("content").update({"video_url": stored_url}).eq("project_id", project_id).execute()
        supabase.table("jobs").update({"status": "done", "result_url": stored_url}).eq("project_id", project_id).eq("type", "video").execute()

        from workers.merge_worker import check_and_merge
        try:
            check_and_merge.delay(project_id)
        except Exception:
            import threading
            threading.Thread(target=check_and_merge, args=(project_id,), daemon=True).start()

    except Exception as exc:
        supabase.table("jobs").update({"status": "failed", "error": str(exc)}).eq("project_id", project_id).eq("type", "video").execute()
        raise


def _poll_runway(task_id: str, headers: dict) -> str:
    deadline = time.time() + POLL_TIMEOUT
    while time.time() < deadline:
        res = requests.get(f"{RUNWAY_BASE}/tasks/{task_id}", headers=headers, timeout=15)
        data = res.json()
        if data["status"] == "SUCCEEDED":
            return data["output"][0]
        if data["status"] == "FAILED":
            raise RuntimeError(f"Runway task failed: {data.get('failure', 'unknown')}")
        time.sleep(POLL_INTERVAL)
    raise TimeoutError(f"Runway task {task_id} timed out after {POLL_TIMEOUT}s")


@app.task(bind=True, max_retries=2, default_retry_delay=120)
def generate_video(self, project_id: str):
    try:
        _run(project_id)
    except Exception as exc:
        raise self.retry(exc=exc)
