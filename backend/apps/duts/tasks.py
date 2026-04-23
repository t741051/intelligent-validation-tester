from celery import shared_task

from .models import Dut
from .services import DutService


@shared_task
def healthcheck_all():
    for dut in Dut.objects.all():
        try:
            DutService.trigger_interface_test(dut, dut.interfaces or [], user=None)
        except Exception:
            continue
