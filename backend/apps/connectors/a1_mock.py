import random

from .base import BaseConnector


class A1MockConnector(BaseConnector):
    def connect(self) -> None:
        return None

    def health_check(self) -> bool:
        return True

    def get_policy_status(self) -> dict:
        return {
            "active_policies": random.randint(0, 20),
            "enforcement_rate": round(random.uniform(0.8, 1.0), 3),
        }

    def disconnect(self) -> None:
        return None
