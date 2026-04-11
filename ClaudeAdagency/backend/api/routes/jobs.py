from fastapi import APIRouter, Depends
from ..auth import get_current_user

router = APIRouter()

@router.get("/{job_id}")
async def get_job_status(job_id: str, user = Depends(get_current_user)):
    return {"job_id": job_id, "status": "processing"}
