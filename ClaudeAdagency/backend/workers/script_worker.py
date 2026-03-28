import os
import json
import anthropic
from workers.celery_app import app
from api.deps import get_supabase

SCRIPT_PROMPT = """
You are an expert Instagram Reels scriptwriter.

Brand: {brand_name}
Product: {product_name}
Tone: {tone}
Target Audience: {target_audience}
Call to Action: {cta}

Generate a complete content package as JSON with exactly these keys:
{{
  "script": "40-50 second spoken script, natural and engaging",
  "hooks": ["hook variant 1", "hook variant 2", "hook variant 3"],
  "shot_list": [
    {{"shot": 1, "description": "...", "duration": "3s", "camera": "close-up"}},
    {{"shot": 2, "description": "...", "duration": "4s", "camera": "medium"}},
    {{"shot": 3, "description": "...", "duration": "3s", "camera": "wide"}},
    {{"shot": 4, "description": "...", "duration": "5s", "camera": "close-up"}},
    {{"shot": 5, "description": "...", "duration": "5s", "camera": "tracking"}}
  ],
  "caption": "Instagram caption, conversational, 150 words max, ends with CTA",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}}

Rules:
- Script must be speakable in exactly 40-50 seconds
- First hook must grab attention in the first 2 seconds
- Shot list must match script timing
- Include 10-15 relevant hashtags
- Return ONLY valid JSON, no extra text
"""


@app.task(bind=True, max_retries=3, default_retry_delay=30)
def generate_script(self, project_id: str):
    supabase = get_supabase()
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    try:
        project = supabase.table("projects").select("*").eq("id", project_id).single().execute().data

        supabase.table("jobs").insert({
            "project_id": project_id,
            "type": "script",
            "status": "running",
            "provider": "claude",
        }).execute()

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": SCRIPT_PROMPT.format(**project)}],
        )

        raw = response.content[0].text.strip()
        start = raw.index("{")
        end = raw.rindex("}") + 1
        content_data = json.loads(raw[start:end])

        existing = supabase.table("content").select("id").eq("project_id", project_id).execute()
        if existing.data:
            supabase.table("content").update(content_data).eq("project_id", project_id).execute()
        else:
            supabase.table("content").insert({"project_id": project_id, **content_data}).execute()

        supabase.table("jobs").update({"status": "done"}).eq("project_id", project_id).eq("type", "script").execute()

        # Kick off voice + video in parallel
        from workers.voice_worker import generate_voice
        from workers.video_worker import generate_video
        generate_voice.delay(project_id)
        generate_video.delay(project_id)

    except Exception as exc:
        supabase.table("jobs").update({"status": "failed", "error": str(exc)}).eq("project_id", project_id).eq("type", "script").execute()
        raise self.retry(exc=exc)
