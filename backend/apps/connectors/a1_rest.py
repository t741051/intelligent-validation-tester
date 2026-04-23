import httpx

from .base import BaseConnector


class A1RestConnector(BaseConnector):
    def connect(self) -> None:
        self._client = httpx.Client(base_url=self.dut.endpoint, timeout=5.0)

    def health_check(self) -> bool:
        try:
            r = self._client.get("/a1-p/policytypes")
            return r.status_code < 500
        except Exception:
            return False

    def disconnect(self) -> None:
        client = getattr(self, "_client", None)
        if client is not None:
            client.close()
