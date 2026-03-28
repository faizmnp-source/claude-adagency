import os
from celery import Celery

app = Celery(
    "instagram_ai",
    broker=os.environ.get("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.environ.get("REDIS_URL", "redis://localhost:6379/0"),
    include=[
        "workers.script_worker",
        "workers.voice_worker",
        "workers.video_worker",
        "workers.merge_worker",
        "workers.post_worker",
        "workers.notification_worker",
    ],
)

app.conf.update(
    task_routes={
        "workers.video_worker.*": {"queue": "video"},
        "workers.*": {"queue": "default"},
    },
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    result_expires=3600,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)
