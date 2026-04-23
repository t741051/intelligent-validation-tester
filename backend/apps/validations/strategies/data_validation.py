from core.utils.scoring import weighted_overall

from .base import ValidationStrategy


class DataValidationStrategy(ValidationStrategy):
    """Skeleton — real implementation will pull PM data via O1 connector
    and score completeness / accuracy / timeliness against baseline."""

    def run(self, run, publish) -> dict:
        metrics: dict[str, float] = {}
        for pct, key, value in [(25, "connectivity", 100.0), (50, "completeness", 90.0),
                                (75, "accuracy", 85.0), (100, "timeliness", 92.0)]:
            metrics[key] = value
            publish(progress=pct, metric=(key, value))
        overall = weighted_overall({k: v for k, v in metrics.items() if k != "connectivity"})
        metrics["overall"] = overall
        return {"score": overall, "metrics": metrics}
