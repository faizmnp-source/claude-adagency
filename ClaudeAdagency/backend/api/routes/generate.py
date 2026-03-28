from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from api.deps import get_supabase
from workers.script_worker import generate_script

router = APIRouter()


@router.post("/generate/{project_id}")
def trigger_generation(project_id: str, supabase: Client = Depends(get_supabase)):
    result = supabase.table("projects").select("id, status").eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")

    supabase.table("projects").update({"status": "generating"}).eq("id", project_id).execute()
    task = generate_script.delay(project_id)

    return {"project_id": project_id, "task_id": task.id, "status": "queued"}
