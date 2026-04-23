import logging

from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.utils import timezone

from .models import MetricPoint, ValidationRun
from .strategies import get_strategy

logger = logging.getLogger(__name__)


def _group(run_id: str) -> str:
    return f"run_{run_id}"


def publish_progress(run_id: str, progress: int, status: str) -> None:
    async_to_sync(get_channel_layer().group_send)(
        _group(run_id),
        {"type": "run.progress", "payload": {"progress": progress, "status": status}},
    )


def publish_metric(run_id: str, key: str, value: float) -> None:
    async_to_sync(get_channel_layer().group_send)(
        _group(run_id),
        {"type": "run.metric", "payload": {"key": key, "value": value}},
    )


def publish_completed(run_id: str, score: float | None, report_url: str) -> None:
    async_to_sync(get_channel_layer().group_send)(
        _group(run_id),
        {"type": "run.completed", "payload": {"score": score, "report_url": report_url}},
    )


def record_metric(run: ValidationRun, key: str, value: float) -> None:
    MetricPoint.objects.create(time=timezone.now(), run=run, metric_key=key, value=value)


@shared_task(bind=True)
def run_validation(self, run_id: str):
    run = ValidationRun.objects.get(id=run_id)
    run.status = ValidationRun.Status.RUNNING
    run.save(update_fields=["status"])
    publish_progress(run_id, 0, "running")

    def publish(progress: int, metric=None):
        publish_progress(run_id, progress, "running")
        if metric is not None:
            key, value = metric
            publish_metric(run_id, key, value)
            record_metric(run, key, value)

    try:
        strategy = get_strategy(run)
        result = strategy.run(run, publish)
        run.score = result.get("score")
        run.status = (
            ValidationRun.Status.PASSED
            if (result.get("score") or 0) >= 80
            else ValidationRun.Status.FAILED
        )
    except Exception as exc:
        logger.exception("Run %s failed: %s", run_id, exc)
        run.status = ValidationRun.Status.FAILED
    finally:
        run.ended_at = timezone.now()
        run.progress = 100
        run.save(update_fields=["status", "ended_at", "score", "progress"])
        publish_completed(run_id, run.score, run.report_url or "")
