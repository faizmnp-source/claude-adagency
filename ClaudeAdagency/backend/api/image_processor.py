"""
Image quality pipeline — lightweight version for Railway deployment.
Uses only Pillow (no heavy ML models).

Steps:
  1. Upscale 2× with LANCZOS (high quality, fast)
  2. Auto-level brightness/contrast
  3. Return high-quality JPEG bytes
"""
import io
from PIL import Image, ImageOps


def process_product_image(image_bytes: bytes) -> tuple[bytes, str]:
    """
    Returns (processed_bytes, content_type).
    Lightweight — only Pillow, no onnxruntime/rembg.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # ── 1. Upscale 2× (cap at 2048px on longest side) ────────────────────────
    w, h = img.size
    scale = min(2.0, 2048 / max(w, h))
    if scale > 1.0:
        new_w, new_h = int(w * scale), int(h * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)

    # ── 2. Auto-enhance brightness / contrast ────────────────────────────────
    img = ImageOps.autocontrast(img, cutoff=1)

    # ── 3. Encode as high-quality JPEG ───────────────────────────────────────
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=95, optimize=True)
    return out.getvalue(), "image/jpeg"
