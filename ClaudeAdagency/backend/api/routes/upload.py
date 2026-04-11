from fastapi import APIRouter, UploadFile, File, Depends
from ..auth import get_current_user

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...), user = Depends(get_current_user)):
    return {"filename": file.filename, "status": "uploaded"}
