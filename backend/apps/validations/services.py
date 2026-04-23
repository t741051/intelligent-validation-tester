from celery import current_app
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.scenarios.models import TestScenario

from .models import ValidationRun


class ValidationService:
    @classmethod
    @transaction.atomic
    def start_run(cls, scenario_id, target_type, target_id, user) -> ValidationRun:
        from .tasks import run_validation

        scenario = None
        if scenario_id:
            scenario = TestScenario.objects.filter(id=scenario_id).first()

        run = ValidationRun.objects.create(
            scenario=scenario,
            target_type=target_type,
            target_id=target_id,
            triggered_by=user,
            status=ValidationRun.Status.PENDING,
        )
        task = run_validation.delay(str(run.id))
        run.celery_task_id = task.id
        run.save(update_fields=["celery_task_id"])
        return run

    @classmethod
    def cancel_run(cls, run_id, user) -> ValidationRun:
        run = ValidationRun.objects.get(id=run_id)
        if run.status not in (ValidationRun.Status.PENDING, ValidationRun.Status.RUNNING):
            raise ValidationError("Run is not cancellable")
        if run.celery_task_id:
            current_app.control.revoke(run.celery_task_id, terminate=True)
        run.status = ValidationRun.Status.CANCELLED
        run.ended_at = timezone.now()
        run.save(update_fields=["status", "ended_at"])
        return run
