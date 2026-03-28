import os
import time
import requests
from workers.celery_app import app
from api.deps import get_supabase

IG_BASE = "https://graph.facebook.com/v21.0"


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def post_to_instagram(self, project_id: str):
    supabase = get_supabase()

    try:
        supabase.table("jobs").insert({
            "project_id": project_id,
            "type": "post",
            "status": "running",
            "provider": "instagram",
        }).execute()

        content = supabase.table("content").select("final_url, caption, hashtags").eq("project_id", project_id).single().execute().data
        ig_account_id = os.environ["IG_ACCOUNT_ID"]
        access_token  = os.environ["IG_ACCESS_TOKEN"]

        hashtag_str = " ".join(content.get("hashtags") or [])
        caption = f"{content['caption']}\n\n{hashtag_str}"

        # Step 1: Create Reels container
        container_res = requests.post(
            f"{IG_BASE}/{ig_account_id}/media",
            params={
                "media_type": "REELS",
                "video_url": content["final_url"],
                "caption": caption,
                "share_to_feed": "true",
                "access_token": access_token,
            },
            timeout=30,
        )
        container_res.raise_for_status()
        container_id = container_res.json()["id"]

        # Step 2: Poll until container processing is done
        for _ in range(40):
            status_res = requests.get(
                f"{IG_BASE}/{container_id}",
                params={"fields": "status_code,status", "access_token": access_token},
                timeout=15,
            )
            status_data = status_res.json()
            if status_data.get("status_code") == "FINISHED":
                break
            if status_data.get("status_code") == "ERROR":
                raise RuntimeError(f"IG container error: {status_data}")
            time.sleep(10)
        else:
            raise TimeoutError("Instagram media container processing timed out")

        # Step 3: Publish
        publish_res = requests.post(
            f"{IG_BASE}/{ig_account_id}/media_publish",
            params={"creation_id": container_id, "access_token": access_token},
            timeout=30,
        )
        publish_res.raise_for_status()
        ig_post_id = publish_res.json().get("id")

        supabase.table("projects").update({"status": "posted", "ig_post_id": ig_post_id}).eq("id", project_id).execute()
        supabase.table("jobs").update({"status": "done"}).eq("project_id", project_id).eq("type", "post").execute()

    except Exception as exc:
        supabase.table("jobs").update({"status": "failed", "error": str(exc)}).eq("project_id", project_id).eq("type", "post").execute()
        raise self.retry(exc=exc)
