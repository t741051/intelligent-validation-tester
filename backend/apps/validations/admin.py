from django.contrib import admin

from .models import MetricPoint, ValidationRun


@admin.register(ValidationRun)
class ValidationRunAdmin(admin.ModelAdmin):
    list_display = ("id", "target_type", "status", "progress", "score",
                    "started_at", "ended_at", "triggered_by")
    list_filter = ("status", "target_type")
    readonly_fields = ("id", "celery_task_id", "started_at", "ended_at")


@admin.register(MetricPoint)
class MetricPointAdmin(admin.ModelAdmin):
    list_display = ("time", "run", "metric_key", "value")
    list_filter = ("metric_key",)
