"""
Video generation worker.
Priority: Kling 2.0 → Runway Gen-4 Turbo → skip (mark failed)

Kling produces up to 3-minute videos in one generation — ideal for 45-50s reels.
Runway produces max 10s clips — used as fallback for quick product clips.
"""
import os
import time
import requests
from workers.celery_app import app
from api.deps import get_supabase

# ── Kling ────────────────────────────────────────────────────────────────────
KLING_BASE     = "https://api.klingai.com/v1"
KLING_TIMEOUT  = 900   # 15 min — Kling takes longer but produces better output
KLING_INTERVAL = 15

# ── Runway ───────────────────────────────────────────────────────────────────
RUNWAY_BASE     = "https://api.dev.runwayml.com/v1"
RUNWAY_TIMEOUT  = 600
RUNWAY_INTERVAL = 10


def _build_video_prompt(project: dict, content: dict) -> str:
    """Build a rich cinematic video prompt from AI-generated script data."""
    # Use Claude's own video_prompt if available (it wrote it specifically for video AI)
    if content.get("video_prompt"):
        return content["video_prompt"]

    # Fallback: construct from shots
    shots = (content.get("shot_list") or [])[:3]
    shot_text = " ".join(s["description"] for s in shots)
    return (
        f"Cinematic product advertisement for {project['product_name']} by {project['brand_name']}. "
        f"{project['tone']} mood. {shot_text} "
        f"Professional lighting, 4K quality, smooth camera movement, luxury aesthetic."
    )


def _run_kling(project_id: str, supabase, project: dict, content: dict) -> str:
    """Submit job to Kling 2.0, poll, return stored Supabase URL."""
    kling_key = os.environ.get("KLING_API_KEY", "")
    if not kling_key:
        raise RuntimeError("KLING_API_KEY not set")

    prompt = _build_video_prompt(project, content)
    headers = {
        "Authorization": f"Bearer {kling_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "kling-v2-master",      # Kling 2.0 — best quality
        "image_url": project["image_url"],
        "prompt": prompt,
        "negative_prompt": "blurry, low quality, watermark, text, distorted, shaky",
        "duration": 10,                   # seconds (Kling supports up to 180)
        "aspect_ratio": "9:16",           # Vertical for Instagram Reels
        "mode": "pro",                    # pro = highest quality
        "cfg_scale": 0.5,
    }

    res = requests.post(f"{KLING_BASE}/videos/image2video", headers=headers, json=payload, timeout=30)
    res.raise_for_status()
    task_id = res.json()["data"]["task_id"]

    supabase.table("jobs").update({"external_id": task_id}).eq("project_id", project_id).eq("type", "video").execute()

    # Poll for completion
    deadline = time.time() + KLING_TIMEOUT
    while time.time() < deadline:
        poll = requests.get(f"{KLING_BASE}/videos/image2video/{task_id}", headers=headers, timeout=15)
        data = poll.json()["data"]
        task_status = data.get("task_status")

        if task_status == "succeed":
            video_url = data["task_result"]["videos"][0]["url"]
            break
        if task_status == "failed":
            raise RuntimeError(f"Kling task failed: {data.get('task_status_msg', 'unknown')}")
        time.sleep(KLING_INTERVAL)
    else:
        raise TimeoutError(f"Kling task {task_id} timed out after {KLING_TIMEOUT}s")

    # Download and store in Supabase
    video_data = requests.get(video_url, timeout=180).content
    storage_path = f"video/{project_id}_raw.mp4"
    supabase.storage.from_("assets").upload(storage_path, video_data, {"content-type": "video/mp4"})
    return supabase.storage.from_("assets").get_public_url(storage_path)


def _run_runway(project_id: str, supabase, project: dict, content: dict) -> str:
    """Submit job to Runway Gen-4 Turbo, poll, return stored Supabase URL."""
    runway_key = os.environ.get("RUNWAY_API_KEY", "")
    if not runway_key:
        raise RuntimeError("RUNWAY_API_KEY not set")

    prompt = _build_video_prompt(project, content)
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

    deadline = time.time() + RUNWAY_TIMEOUT
    while time.time() < deadline:
        poll = requests.get(f"{RUNWAY_BASE}/tasks/{task_id}", headers=headers, timeout=15)
        data = poll.json()
        if data["status"] == "SUCCEEDED":
            video_url = data["output"][0]
            break
        if data["status"] == "FAILED":
            raise RuntimeError(f"Runway task failed: {data.get('failure', 'unknown')}")
        time.sleep(RUNWAY_INTERVAL)
    else:
        raise TimeoutError(f"Runway task {task_id} timed out")

    video_data = requests.get(video_url, timeout=120).content
    storage_path = f"video/{project_id}_raw.mp4"
    supabase.storage.from_("assets").upload(storage_path, video_data, {"content-type": "video/mp4"})
    return supabase.storage.from_("assets").get_public_url(storage_path)


def _run(project_id: str):
    """Core logic — Kling first, Runway fallback, callable without Celery."""
    supabase = get_supabase()

    supabase.table("jobs").insert({
        "project_id": project_id,
        "type": "video",
        "status": "running",
        "provider": "kling",
    }).execute()

    try:
        project = supabase.table("projects").select("*").eq("id", project_id).single().execute().data
        content = supabase.table("content").select("*").eq("project_id", project_id).single().execute().data

        stored_url = None
        provider_used = "kling"

        # ── Try Kling first ──────────────────────────────────────────────────
        kling_key = os.environ.get("KLING_API_KEY", "")
        if kling_key:
            try:
                stored_url = _run_kling(project_id, supabase, project, content)
            except Exception as kling_err:
                print(f"[video_worker] Kling failed ({kling_err}), falling back to Runway")
                stored_url = None

        # ── Runway fallback ──────────────────────────────────────────────────
        if not stored_url:
            provider_used = "runway"
            stored_url = _run_runway(project_id, supabase, project, content)

        supabase.table("content").update({"video_url": stored_url}).eq("project_id", project_id).execute()
        supabase.table("jobs").update({
            "status": "done",
            "provider": provider_used,
            "result_url": stored_url,
        }).eq("project_id", project_id).eq("type", "video").execute()

        # Trigger merge
        from workers.merge_worker import check_and_merge
        import threading
        try:
            check_and_merge.delay(project_id)
        except Exception:
            threading.Thread(target=check_and_merge, args=(project_id,), daemon=True).start()

    except Exception as exc:
        supabase.table("jobs").update({
            "status": "failed", "error": str(exc)
        }).eq("project_id", project_id).eq("type", "video").execute()
        raise


@app.task(bind=True, max_retries=2, default_retry_delay=120)
def generate_video(self, project_id: str):
    try:
        _run(project_id)
    except Exception as exc:
        raise self.retry(exc=exc)
