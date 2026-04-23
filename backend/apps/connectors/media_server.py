import httpx
from django.conf import settings


class MediaServerClient:
    """Thin wrapper around MediaMTX HTTP control API."""

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings.MEDIA_SERVER_API

    def list_paths(self) -> list[dict]:
        with httpx.Client(base_url=self.base_url, timeout=3.0) as c:
            r = c.get("/v3/paths/list")
            r.raise_for_status()
            return r.json().get("items", [])
