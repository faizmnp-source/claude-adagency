import os
import json
import datetime
import anthropic
from workers.celery_app import app
from api.deps import get_supabase

# ── Trend-aware system prompt ────────────────────────────────────────────────
SYSTEM_PROMPT = """You are a world-class Instagram Reels scriptwriter and social media strategist.
You have deep knowledge of:
- Current viral content formats on Instagram, TikTok and YouTube Shorts
- Consumer psychology and purchase triggers
- Storytelling frameworks: hook → problem → solution → proof → CTA
- Platform algorithm behaviour (watch-time, saves, shares)
- Luxury, beauty, wellness, fashion and lifestyle brand voice

Your scripts consistently go viral because you:
1. Open with a PATTERN INTERRUPT in the first 1.5 seconds (surprising stat, bold claim, or question)
2. Build tension and curiosity in seconds 2-8
3. Deliver the product as the hero solution
4. Use sensory language that makes viewers feel the product
5. End with a soft CTA that feels like advice, not a sales pitch

You know the current trends: before/after reveals, POV formats, "I tried X for 30 days",
UGC-style authentic storytelling, trending audio references, micro-influencer tone.
Always write like a real person speaking, not a brand.
"""

SCRIPT_PROMPT = """Create a viral Instagram Reel content package for this product.

Brand: {brand_name}
Product: {product_name}
Tone: {tone}
Target Audience: {target_audience}
Call to Action: {cta}
Date Context: {date_context}

IMPORTANT: The script must be written for a 45-50 second spoken video.
Use the most viral format for this product category right now.
The hook must stop thumbs from scrolling in 1.5 seconds.

Return ONLY valid JSON with exactly these keys:
{{
  "script": "Full 45-50 second spoken script. Natural speech. No stage directions. Just the words that are spoken.",
  "hook_type": "The format used (e.g. bold_claim / question / stat / pov / before_after)",
  "hooks": [
    "Hook variant 1 — shock or curiosity",
    "Hook variant 2 — relatable problem",
    "Hook variant 3 — social proof angle"
  ],
  "video_prompt": "A detailed prompt for AI video generation. Describe visuals, lighting, movement, mood, and style as if briefing a cinematographer. 60-80 words.",
  "shot_list": [
    {{"shot": 1, "description": "exact visual", "duration": "3s", "camera": "extreme close-up", "vibe": "mysterious"}},
    {{"shot": 2, "description": "exact visual", "duration": "5s", "camera": "medium shot", "vibe": "confident"}},
    {{"shot": 3, "description": "exact visual", "duration": "4s", "camera": "wide", "vibe": "aspirational"}},
    {{"shot": 4, "description": "exact visual", "duration": "5s", "camera": "close-up", "vibe": "satisfying"}},
    {{"shot": 5, "description": "exact visual", "duration": "5s", "camera": "tracking shot", "vibe": "elevated"}}
  ],
  "caption": "Instagram caption. Conversational, 120 words max. Opens with the hook. Ends naturally with the CTA. Feels like a friend's recommendation.",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
  "trending_audio_suggestion": "Suggest a type of audio/music that would work (e.g. 'trending lo-fi beat', 'emotional piano', 'hype trap')",
  "best_posting_time": "Best day and time to post for maximum reach for this audience"
}}
"""


def _run(project_id: str):
    """Core logic — callable directly without Celery."""
    supabase = get_supabase()
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    project = supabase.table("projects").select("*").eq("id", project_id).single().execute().data

    supabase.table("jobs").insert({
        "project_id": project_id,
        "type": "script",
        "status": "running",
        "provider": "claude",
    }).execute()

    try:
        # Inject current date so Claude can reference current trends
        date_context = datetime.datetime.utcnow().strftime("%B %Y")

        user_message = SCRIPT_PROMPT.format(
            **project,
            date_context=date_context,
        )

        response = client.messages.create(
            model="claude-sonnet-4-6",       # Upgrade to Sonnet for better creativity
            max_tokens=3000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )

        raw = response.content[0].text.strip()
        # Extract JSON robustly
        start = raw.index("{")
        end = raw.rindex("}") + 1
        content_data = json.loads(raw[start:end])

        # Upsert content record
        existing = supabase.table("content").select("id").eq("project_id", project_id).execute()
        if existing.data:
            supabase.table("content").update(content_data).eq("project_id", project_id).execute()
        else:
            supabase.table("content").insert({"project_id": project_id, **content_data}).execute()

        supabase.table("jobs").update({"status": "done"}).eq("project_id", project_id).eq("type", "script").execute()

        # Kick off voice + video — try Celery, fall back to threads
        from workers.voice_worker import generate_voice, _run as _voice_run
        from workers.video_worker import generate_video, _run as _video_run
        import threading
        try:
            generate_voice.delay(project_id)
            generate_video.delay(project_id)
        except Exception:
            threading.Thread(target=_voice_run, args=(project_id,), daemon=True).start()
            threading.Thread(target=_video_run, args=(project_id,), daemon=True).start()

    except Exception as exc:
        supabase.table("jobs").update({
            "status": "failed", "error": str(exc)
        }).eq("project_id", project_id).eq("type", "script").execute()
        raise


@app.task(bind=True, max_retries=3, default_retry_delay=30)
def generate_script(self, project_id: str):
    try:
        _run(project_id)
    except Exception as exc:
        raise self.retry(exc=exc)
