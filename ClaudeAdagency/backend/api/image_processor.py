"""
Image quality pipeline:
  1. Upscale 2× with LANCZOS
  2. Remove background with rembg (U2Net)
  3. Composite on clean dark brand background
  4. Return high-quality JPEG bytes
"""
import io
from PIL import Image


def process_product_image(image_bytes: bytes) -> tuple[bytes, str]:
    """
    Returns (processed_bytes, content_type).
    Falls back gracefully if rembg is not installed.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

    # ── 1. Upscale 2× (max 2048px on longest side) ──────────────────────────
    w, h = img.size
    scale = min(2.0, 2048 / max(w, h))
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # ── 2. Background removal ────────────────────────────────────────────────
    try:
        from rembg import remove
        img = remove(img)          # returns RGBA with transparent bg
    except Exception:
        pass                       # rembg not installed or model unavailable

    # ── 3. Composite on brand dark background ────────────────────────────────
    bg_color = (10, 10, 10, 255)   # near-black matching --ink
    canvas = Image.new("RGBA", img.size, bg_color)
    if img.mode == "RGBA":
        canvas.paste(img, mask=img.split()[3])
    else:
        canvas.paste(img)

    # ── 4. Encode as high-quality JPEG ──────────────────────────────────────
    final = canvas.convert("RGB")
    out = io.BytesIO()
    final.save(out, format="JPEG", quality=95, optimize=True)
    return out.getvalue(), "image/jpeg"
