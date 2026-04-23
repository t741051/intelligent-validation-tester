from abc import ABC, abstractmethod


class BaseConnector(ABC):
    def __init__(self, dut):
        self.dut = dut

    @abstractmethod
    def connect(self) -> None: ...

    @abstractmethod
    def health_check(self) -> bool: ...

    @abstractmethod
    def disconnect(self) -> None: ...
