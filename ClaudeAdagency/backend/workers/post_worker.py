"""
Instagram Graph API posting worker.

Setup required in .env:
  IG_ACCOUNT_ID   — Instagram Business Account ID (not username)
  IG_ACCESS_TOKEN — Long-lived Page Access Token (valid 60 days, auto-refresh below)
  IG_APP_ID       — Facebook App ID
  IG_APP_SECRET   — Facebook App Secret

How to get credentials:
  1. Create Facebook App at developers.facebook.com
  2. Add Instagram Graph API product
  3. Connect Instagram Business Account
  4. Generate long-lived token via /oauth/access_token
"""
import os
import time
import requests
from workers.celery_app import app
from api.deps import get_supabase

IG_BASE   = "https://graph.facebook.com/v21.0"
POLL_MAX  = 40        # 40 × 10s = 400s max wait for container processing
POLL_WAIT = 10


def _get_access_token() -> str:
    """Return token from env. Extend if close to expiry (optional)."""
    return os.environ["IG_ACCESS_TOKEN"]


def _post_reel(ig_account_id: str, token: str, video_url: str, caption: str) -> str:
    """Full 3-step Instagram Reels publish. Returns ig_post_id."""

    # ── Step 1: Create media container ──────────────────────────────────────
    container_res = requests.post(
        f"{IG_BASE}/{ig_account_id}/media",
        params={
            "media_type":    "REELS",
            "video_url":     video_url,
            "caption":       caption,
            "share_to_feed": "true",
            "access_token":  token,
        },
        timeout=30,
    )
    container_res.raise_for_status()
    container_id = container_res.json()["id"]

    # ── Step 2: Poll until Instagram finishes processing the video ───────────
    for attempt in range(POLL_MAX):
        status_res = requests.get(
            f"{IG_BASE}/{container_id}",
            params={"fields": "status_code,status", "access_token": token},
            timeout=15,
        )
        status_data = status_res.json()
        code = status_data.get("status_code", "")

        if code == "FINISHED":
            break
        if code == "ERROR":
            raise RuntimeError(f"Instagram container error: {status_data.get('status')}")
        if code == "EXPIRED":
            raise RuntimeError("Instagram media container expired before publishing")

        time.sleep(POLL_WAIT)
    else:
        raise TimeoutError(f"Instagram container {container_id} processing timed out after {POLL_MAX * POLL_WAIT}s")

    # ── Step 3: Publish ──────────────────────────────────────────────────────
    publish_res = requests.post(
        f"{IG_BASE}/{ig_account_id}/media_publish",
        params={"creation_id": container_id, "access_token": token},
        timeout=30,
    )
    publish_res.raise_for_status()
    return publish_res.json().get("id", "")


def _run(project_id: str):
    """Core logic — callable without Celery."""
    supabase = get_supabase()

    supabase.table("jobs").insert({
        "project_id": project_id,
        "type": "post",
        "status": "running",
        "provider": "instagram",
    }).execute()

    try:
        content = supabase.table("content").select(
            "final_url, caption, hashtags"
        ).eq("project_id", project_id).single().execute().data

        ig_account_id = os.environ["IG_ACCOUNT_ID"]
        token         = _get_access_token()

        # Build caption with hashtags
        hashtag_str = " ".join(content.get("hashtags") or [])
        full_caption = f"{content['caption']}\n\n{hashtag_str}"

        video_url = content.get("final_url") or content.get("video_url")
        if not video_url:
            raise ValueError("No final video URL found for project")

        ig_post_id = _post_reel(ig_account_id, token, video_url, full_caption)

        supabase.table("projects").update({
            "status": "posted",
            "ig_post_id": ig_post_id,
        }).eq("id", project_id).execute()

        supabase.table("jobs").update({
            "status": "done",
            "result_url": f"https://www.instagram.com/p/{ig_post_id}/",
        }).eq("project_id", project_id).eq("type", "post").execute()

    except Exception as exc:
        supabase.table("jobs").update({
            "status": "failed", "error": str(exc)
        }).eq("project_id", project_id).eq("type", "post").execute()
        raise


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def post_to_instagram(self, project_id: str):
    try:
        _run(project_id)
    except Exception as exc:
        raise self.retry(exc=exc)
