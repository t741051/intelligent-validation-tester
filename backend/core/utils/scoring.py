"""Aggregate a dict of sub-metrics into one overall score.

Weights come from the data-validation strategy: completeness / accuracy /
timeliness have equal weight by default.
"""
from __future__ import annotations

DEFAULT_WEIGHTS = {
    "completeness": 0.35,
    "accuracy": 0.35,
    "timeliness": 0.30,
}


def weighted_overall(metrics: dict[str, float], weights: dict[str, float] | None = None) -> float:
    w = weights or DEFAULT_WEIGHTS
    total_w = sum(w.get(k, 0) for k in metrics)
    if total_w == 0:
        return 0.0
    return round(sum(metrics[k] * w.get(k, 0) for k in metrics) / total_w, 2)
