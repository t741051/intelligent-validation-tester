from abc import ABC, abstractmethod
from typing import Callable


class ValidationStrategy(ABC):
    @abstractmethod
    def run(self, run, publish: Callable) -> dict:
        """Execute validation. Call publish(progress, metric=(k,v)) for live updates.

        Returns {'score': float, 'metrics': dict}.
        """
