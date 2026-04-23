import random

from .base import BaseConnector


class E2MockConnector(BaseConnector):
    def connect(self) -> None:
        return None

    def health_check(self) -> bool:
        return True

    def get_subscription_count(self) -> int:
        return random.randint(0, 50)

    def disconnect(self) -> None:
        return None
