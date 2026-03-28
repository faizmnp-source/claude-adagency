import os
from dotenv import load_dotenv

# Load .env from project root (works whether run from backend/ or project root)
_env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=_env_path, override=False)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import upload, generate, jobs, webhooks

app = FastAPI(title="Instagram AI Platform", version="1.0.0")

ALLOWED_ORIGINS = [
    "https://thecraftstudios.in",
    "https://www.thecraftstudios.in",
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


