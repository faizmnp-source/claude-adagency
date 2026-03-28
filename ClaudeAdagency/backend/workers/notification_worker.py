import os
import requests
from workers.celery_app import app
from api.deps import get_supabase

WA_BASE = "https://graph.facebook.com/v21.0"


@app.task
def send_preview(project_id: str):
    supabase = get_supabase()
    content = supabase.table("content").select("final_url, caption").eq("project_id", project_id).single().execute().data
    project = supabase.table("projects").select("brand_name, product_name").eq("id", project_id).single().execute().data

    phone_number_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    client_phone    = os.environ.get("CLIENT_WHATSAPP_NUMBER")
    wa_token        = os.environ.get("WHATSAPP_TOKEN")

    if not all([phone_number_id, client_phone, wa_token]):
        # Dashboard-only mode — just mark as review, frontend polls
        return

    payload = {
        "messaging_product": "whatsapp",
        "to": client_phone,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": (
                    f"Your reel for *{project['brand_name']} — {project['product_name']}* is ready!\n\n"
                    f"Preview: {content['final_url']}\n\n"
                    "Please review and approve or reject below."
                )
            },
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": f"approve_{project_id}", "title": "Approve"}},
                    {"type": "reply", "reply": {"id": f"reject_{project_id}", "title": "Reject"}},
                ]
            },
        },
    }

    requests.post(
        f"{WA_BASE}/{phone_number_id}/messages",
        headers={"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"},
        json=payload,
        timeout=15,
    )

    supabase.table("approvals").insert({
        "project_id": project_id,
        "channel": "whatsapp",
        "sent_at": "now()",
    }).execute()
