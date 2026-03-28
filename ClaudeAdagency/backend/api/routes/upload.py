import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends
from supabase import Client
from api.deps import get_supabase
from api.image_processor import process_product_image

router = APIRouter()


@router.post("/upload")
async def upload_product(
    image: UploadFile = File(...),
    brand_name: str = Form(...),
    product_name: str = Form(...),
    tone: str = Form(...),
    target_audience: str = Form(...),
    cta: str = Form(...),
    supabase: Client = Depends(get_supabase),
):
    project_id = str(uuid.uuid4())

    # ── Run image quality pipeline (upscale + bg removal + clean bg) ────────
    raw_bytes = await image.read()
    processed_bytes, content_type = process_product_image(raw_bytes)

    # Always store as .jpg after processing
    storage_path = f"products/{project_id}.jpg"
    supabase.storage.from_("assets").upload(
        storage_path, processed_bytes, {"content-type": content_type}
    )
    image_url = supabase.storage.from_("assets").get_public_url(storage_path)

    supabase.table("projects").insert({
        "id": project_id,
        "brand_name": brand_name,
        "product_name": product_name,
        "tone": tone,
        "target_audience": target_audience,
        "cta": cta,
        "image_url": image_url,
        "status": "pending",
    }).execute()

    return {"project_id": project_id, "image_url": image_url}
