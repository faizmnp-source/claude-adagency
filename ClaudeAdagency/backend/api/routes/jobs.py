from fastapi import APIRouter, Depends
from supabase import Client
from api.deps import get_supabase

router = APIRouter()


@router.get("/jobs/{project_id}")
def get_jobs(project_id: str, supabase: Client = Depends(get_supabase)):
    jobs = supabase.table("jobs").select("*").eq("project_id", project_id).order("created_at").execute()
    project = supabase.table("projects").select("status").eq("id", project_id).single().execute()
    return {
        "project_status": project.data["status"] if project.data else "unknown",
        "jobs": jobs.data,
    }


@router.get("/projects")
def list_projects(supabase: Client = Depends(get_supabase)):
    result = supabase.table("projects").select("*").order("created_at", desc=True).execute()
    return result.data


@router.get("/projects/{project_id}")
def get_project(project_id: str, supabase: Client = Depends(get_supabase)):
    project = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    content = supabase.table("content").select("*").eq("project_id", project_id).single().execute()
    return {"project": project.data, "content": content.data}
