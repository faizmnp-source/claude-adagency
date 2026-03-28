import os
from dotenv import load_dotenv

# Try local .env first (dev), then parent dirs, then rely on Railway env vars
for _candidate in [
    os.path.join(os.path.dirname(__file__), "..", "..", ".env"),  # repo root (local dev)
    os.path.join(os.path.dirname(__file__), "..", ".env"),        # backend/
    ".env",                                                        # cwd
]:
    if os.path.exists(_candidate):
        load_dotenv(dotenv_path=_candidate, override=False)
        break
# On Railway all vars come from environment — no .env file needed

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import upload, generate, jobs, webhooks

app = FastAPI(title="Instagram AI Platform", version="1.0.0")

ALLOWED_ORIGINS = [
    "https://thecraftstudios.in",
    "https://www.thecraftstudios.in",
    "https://claude-adagency.vercel.app",   # Vercel preview URL
    "https://claude-adagency-production.up.railway.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(webhooks.router, prefix="/api", tags=["webhooks"])


@app.get("/health")
def health():
    return {"status": "ok"}


