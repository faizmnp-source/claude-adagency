from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import upload, generate, jobs, webhooks

app = FastAPI(title="Instagram AI Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
