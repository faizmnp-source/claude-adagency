import threading
from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from api.deps import get_supabase

router = APIRouter()


def _run_pipeline(project_id: str):
    """Run the full generation pipeline in a background thread (no Redis needed)."""
    from workers.script_worker import _run as _script_run
    _script_run(project_id)


@router.post("/generate/{project_id}")
def trigger_generation(project_id: str, supabase: Client = Depends(get_supabase)):
    result = supabase.table("projects").select("id, status").eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")

    supabase.table("projects").update({"status": "generating"}).eq("id", project_id).execute()

    # Try Celery first (production); fall back to background thread (local dev, no Redis)
    try:
        from workers.script_worker import generate_script
        task = generate_script.delay(project_id)
        return {"project_id": project_id, "task_id": task.id, "status": "queued"}
    except Exception:
        # Redis not available — run directly in a daemon thread
        t = threading.Thread(target=_run_pipeline, args=(project_id,), daemon=True)
        t.start()
        return {"project_id": project_id, "task_id": "local", "status": "queued"}
