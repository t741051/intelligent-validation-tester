import random

from .base import BaseConnector


class O1MockConnector(BaseConnector):
    def connect(self) -> None:
        return None

    def health_check(self) -> bool:
        return True

    def get_pm_data(self) -> dict:
        return {
            "throughput_mbps": random.uniform(100, 1000),
            "rsrp_dbm": random.uniform(-90, -60),
            "rsrq_db": random.uniform(-15, -5),
        }

    def disconnect(self) -> None:
        return None
