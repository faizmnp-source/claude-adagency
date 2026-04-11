from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/shotstack")
async def shotstack_webhook(request: Request):
    data = await request.json()
    return {"status": "received"}
