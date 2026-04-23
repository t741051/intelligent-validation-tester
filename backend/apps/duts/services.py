from django.db import transaction
from django.utils import timezone

from apps.connectors.factory import get_connector_for_interface

from .models import Dut


class DutService:
    @classmethod
    @transaction.atomic
    def trigger_interface_test(cls, dut: Dut, interfaces: list[str], user) -> dict:
        results: dict[str, dict] = {}
        for iface in interfaces:
            connector = get_connector_for_interface(iface, dut)
            try:
                connector.connect()
                ok = connector.health_check()
                results[iface] = {"ok": bool(ok), "error": None}
            except Exception as exc:
                results[iface] = {"ok": False, "error": str(exc)}
            finally:
                try:
                    connector.disconnect()
                except Exception:
                    pass

        if not results:
            dut.status = Dut.Status.OFFLINE
            overall_ok = False
        else:
            overall_ok = all(r["ok"] for r in results.values())
            dut.status = Dut.Status.ONLINE if overall_ok else Dut.Status.ERROR
        dut.last_check = timezone.now()
        dut.save(update_fields=["status", "last_check"])
        return {"dut_id": str(dut.id), "results": results, "ok": overall_ok}
