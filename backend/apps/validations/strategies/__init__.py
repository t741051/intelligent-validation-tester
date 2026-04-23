from django.conf import settings

from .base import ValidationStrategy
from .data_validation import DataValidationStrategy
from .intelligence import IntelligenceValidationStrategy
from .mock import MockValidationStrategy


def get_strategy(run) -> ValidationStrategy:
    if settings.USE_MOCK_CONNECTORS:
        return MockValidationStrategy()
    if run.target_type == "application":
        return IntelligenceValidationStrategy()
    return DataValidationStrategy()


__all__ = (
    "ValidationStrategy",
    "DataValidationStrategy",
    "IntelligenceValidationStrategy",
    "MockValidationStrategy",
    "get_strategy",
)
