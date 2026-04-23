import random
import time

from core.utils.scoring import weighted_overall

from .base import ValidationStrategy


class MockValidationStrategy(ValidationStrategy):
    """Simulates a 10-30s run with reasonable scores. Used when
    USE_MOCK_CONNECTORS is enabled."""

    def run(self, run, publish) -> dict:
        metrics: dict[str, float] = {}
        keys = ["completeness", "accuracy", "timeliness"]
        for i, key in enumerate(keys, start=1):
            time.sleep(random.uniform(2, 4))
            value = round(random.uniform(75, 98), 2)
            metrics[key] = value
            publish(progress=int(i * 100 / len(keys)) - 5, metric=(key, value))
        overall = weighted_overall(metrics)
        metrics["overall"] = overall
        publish(progress=100, metric=("overall", overall))
        return {"score": overall, "metrics": metrics}
