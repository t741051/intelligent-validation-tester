import uuid

from django.db import models


class ValidationRun(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        PASSED = "passed", "Passed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    class TargetType(models.TextChoices):
        PLATFORM = "platform", "Platform"
        APPLICATION = "application", "Application"
        DUT = "dut", "DUT"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scenario = models.ForeignKey(
        "scenarios.TestScenario", on_delete=models.PROTECT, related_name="runs",
        null=True, blank=True,
    )
    target_type = models.CharField(max_length=16, choices=TargetType.choices)
    target_id = models.UUIDField()
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    progress = models.IntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    report_url = models.URLField(blank=True)
    celery_task_id = models.CharField(max_length=128, blank=True)
    triggered_by = models.ForeignKey(
        "accounts.User", on_delete=models.PROTECT, related_name="runs",
    )

    class Meta:
        indexes = [
            models.Index(fields=["status", "started_at"]),
            models.Index(fields=["target_type", "target_id"]),
        ]
        ordering = ("-started_at",)


class MetricPoint(models.Model):
    """Stored in a TimescaleDB hypertable via a RunSQL migration (see 03 §5.2)."""

    time = models.DateTimeField()
    run = models.ForeignKey(ValidationRun, on_delete=models.CASCADE, related_name="metrics")
    metric_key = models.CharField(max_length=64)
    value = models.FloatField()
    tags = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "metrics"
        indexes = [models.Index(fields=["run", "metric_key"])]
