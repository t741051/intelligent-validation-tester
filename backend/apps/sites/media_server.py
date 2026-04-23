"""MediaMTX integration — register/unregister RTSP→HLS pull paths.

A `Camera` with `rtsp_url` gets its own path in MediaMTX named `cam-<uuid>`.
MediaMTX then exposes HLS at `http://<host>:8888/cam-<uuid>/index.m3u8`,
which nginx proxies to `/hls/cam-<uuid>/index.m3u8` for the browser.
"""

from __future__ import annotations

import json
import logging
import os
from urllib import request as urlreq
from urllib.error import HTTPError, URLError

logger = logging.getLogger(__name__)

MEDIAMTX_API = os.environ.get("MEDIAMTX_API", "http://mediamtx:9997").rstrip("/")
MEDIAMTX_PUBLIC_HLS = os.environ.get("MEDIAMTX_PUBLIC_HLS", "/hls")


def _request(method: str, path: str, body: dict | None = None) -> int:
    data = json.dumps(body).encode() if body is not None else None
    req = urlreq.Request(
        f"{MEDIAMTX_API}{path}",
        data=data,
        method=method,
        headers={"Content-Type": "application/json"} if data else {},
    )
    try:
        with urlreq.urlopen(req, timeout=5) as resp:
            return resp.status
    except HTTPError as exc:
        return exc.code
    except URLError as exc:
        logger.warning("MediaMTX %s %s failed: %s", method, path, exc)
        return 0


def path_name(camera_id: str) -> str:
    return f"cam-{camera_id}"


def public_stream_url(camera_id: str) -> str:
    """Browser-facing HLS URL (served through nginx)."""
    return f"{MEDIAMTX_PUBLIC_HLS.rstrip('/')}/{path_name(camera_id)}/index.m3u8"


def register(camera_id: str, rtsp_url: str) -> bool:
    """Create or replace the pull path for this camera. Idempotent.

    Uses TCP interleaved transport so RTP rides inside the TCP control
    channel — required for tunneled cameras (ngrok / SSH forward / VPN)
    where UDP isn't available.
    """
    name = path_name(camera_id)
    body = {
        "source": rtsp_url,
        "sourceOnDemand": True,
        "rtspTransport": "tcp",
    }
    status = _request("POST", f"/v3/config/paths/add/{name}", body)
    if status == 400:
        # path already exists — update instead
        status = _request("PATCH", f"/v3/config/paths/patch/{name}", body)
    return 200 <= status < 300


def unregister(camera_id: str) -> None:
    name = path_name(camera_id)
    _request("DELETE", f"/v3/config/paths/delete/{name}")
