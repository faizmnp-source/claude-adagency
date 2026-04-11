from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

import sys
import os

# Add the current directory to sys.path to allow 'from api.routes' to work
# regardless of whether we are running from 'backend' or 'api' parent
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from api.routes import upload, generate, jobs, webhooks
except ImportError:
    from .routes import upload, generate, jobs, webhooks

app = FastAPI(title="Claude Ad Agency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api/generate", tags=["generate"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

@app.get("/")
async def root():
    return {"message": "Claude Ad Agency API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
