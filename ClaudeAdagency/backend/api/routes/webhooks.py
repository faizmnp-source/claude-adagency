from fastapi import APIRouter, Request, HTTPException
from api.deps import get_supabase
from workers.post_worker import post_to_instagram

router = APIRouter()


@router.get("/webhooks/whatsapp")
def whatsapp_verify(hub_mode: str = None, hub_challenge: str = None, hub_verify_token: str = None):
    """WhatsApp webhook verification handshake."""
    import os
    if hub_mode == "subscribe" and hub_verify_token == os.environ.get("WHATSAPP_VERIFY_TOKEN"):
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhooks/whatsapp")
async def whatsapp_webhook(request: Request):
    body = await request.json()
    supabase = get_supabase()

    try:
        msg = body["entry"][0]["changes"][0]["value"]["messages"][0]
        if msg["type"] != "interactive":
            return {"status": "ignored"}

        reply_id = msg["interactive"]["button_reply"]["id"]
        reply_text = msg["interactive"]["button_reply"]["title"]
        project_id = reply_id.split("_", 1)[1]
    except (KeyError, IndexError):
        return {"status": "ignored"}

    if reply_text == "Approve":
        supabase.table("approvals").update({"approved_at": "now()"}).eq("project_id", project_id).execute()
        supabase.table("projects").update({"status": "approved"}).eq("id", project_id).execute()
        post_to_instagram.delay(project_id)

    elif reply_text == "Reject":
        supabase.table("projects").update({"status": "pending"}).eq("id", project_id).execute()

    return {"status": "ok"}


@router.post("/webhooks/approve/{project_id}")
def dashboard_approve(project_id: str, action: str):
    """Dashboard manual approve/reject endpoint."""
    supabase = get_supabase()
    if action == "approve":
        supabase.table("approvals").update({"approved_at": "now()"}).eq("project_id", project_id).execute()
        supabase.table("projects").update({"status": "approved"}).eq("id", project_id).execute()
        post_to_instagram.delay(project_id)
    elif action == "reject":
        supabase.table("projects").update({"status": "pending"}).eq("id", project_id).execute()
    return {"status": "ok", "action": action}
