import os
import subprocess
import requests
import tempfile
from workers.celery_app import app
from api.deps import get_supabase


@app.task
def check_and_merge(project_id: str):
    """Called after voice or video completes. Merges when both are ready."""
    supabase = get_supabase()
    content = supabase.table("content").select("voice_url, video_url, script, final_url").eq("project_id", project_id).single().execute().data

    if not content["voice_url"] or not content["video_url"]:
        return  # other job not done yet

    if content["final_url"]:
        return  # already merged

    merge_media.delay(project_id)


@app.task(bind=True, max_retries=2, default_retry_delay=60)
def merge_media(self, project_id: str):
    supabase = get_supabase()

    try:
        supabase.table("jobs").insert({
            "project_id": project_id,
            "type": "merge",
            "status": "running",
            "provider": "ffmpeg",
        }).execute()

        content = supabase.table("content").select("voice_url, video_url, script").eq("project_id", project_id).single().execute().data

        with tempfile.TemporaryDirectory() as tmp:
            video_path = os.path.join(tmp, "video.mp4")
            voice_path = os.path.join(tmp, "voice.mp3")
            srt_path   = os.path.join(tmp, "subs.srt")
            output_path = os.path.join(tmp, "final.mp4")

            for url, path in [(content["video_url"], video_path), (content["voice_url"], voice_path)]:
                r = requests.get(url, timeout=120)
                r.raise_for_status()
                with open(path, "wb") as f:
                    f.write(r.content)

            _write_srt(content["script"], srt_path)

            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-i", voice_path,
                "-map", "0:v", "-map", "1:a",
                "-vf", f"subtitles={srt_path}:force_style='FontName=Arial,FontSize=20,PrimaryColour=&H00FFFFFF,Bold=1,Outline=1'",
                "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                "-c:a", "aac", "-b:a", "128k",
                "-shortest",
                output_path,
            ]
            subprocess.run(cmd, check=True, capture_output=True)

            with open(output_path, "rb") as f:
                supabase.storage.from_("assets").upload(f"final/{project_id}.mp4", f.read())

        final_url = supabase.storage.from_("assets").get_public_url(f"final/{project_id}.mp4")
        supabase.table("content").update({"final_url": final_url}).eq("project_id", project_id).execute()
        supabase.table("projects").update({"status": "review"}).eq("id", project_id).execute()
        supabase.table("jobs").update({"status": "done", "result_url": final_url}).eq("project_id", project_id).eq("type", "merge").execute()

        from workers.notification_worker import send_preview
        send_preview.delay(project_id)

    except Exception as exc:
        supabase.table("jobs").update({"status": "failed", "error": str(exc)}).eq("project_id", project_id).eq("type", "merge").execute()
        raise self.retry(exc=exc)


def _write_srt(script: str, srt_path: str, wps: float = 2.5):
    words = script.split()
    chunk_size = 5
    chunks = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

    def fmt(secs: float) -> str:
        h = int(secs // 3600)
        m = int((secs % 3600) // 60)
        s = int(secs % 60)
        ms = int((secs % 1) * 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"

    with open(srt_path, "w", encoding="utf-8") as f:
        t = 0.0
        for i, chunk in enumerate(chunks, 1):
            dur = len(chunk.split()) / wps
            f.write(f"{i}\n{fmt(t)} --> {fmt(t + dur)}\n{chunk}\n\n")
            t += dur
