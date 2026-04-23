from django.conf import settings

from .base import BaseConnector


class O1NetconfConnector(BaseConnector):
    """Real NETCONF implementation — wired up when USE_MOCK_CONNECTORS=false.

    Skeleton: uses ncclient when actually connecting to an O-RAN device.
    """

    def connect(self) -> None:
        from ncclient import manager

        self._session = manager.connect(
            host=self.dut.endpoint,
            username=settings.O1_USERNAME,
            password=settings.O1_PASSWORD,
            hostkey_verify=False,
            timeout=5,
        )

    def health_check(self) -> bool:
        return bool(getattr(self, "_session", None))

    def disconnect(self) -> None:
        sess = getattr(self, "_session", None)
        if sess is not None:
            sess.close_session()
