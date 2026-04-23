from .base import BaseConnector


class E2ApConnector(BaseConnector):
    """Placeholder for real E2AP (SCTP) transport — to be implemented."""

    def connect(self) -> None:
        raise NotImplementedError("Real E2AP transport not yet wired — set USE_MOCK_CONNECTORS=true")

    def health_check(self) -> bool:
        return False

    def disconnect(self) -> None:
        return None
