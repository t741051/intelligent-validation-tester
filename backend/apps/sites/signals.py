from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from . import media_server
from .models import Camera


@receiver(pre_save, sender=Camera)
def _snapshot_rtsp(sender, instance: Camera, **_):
    """Remember the prior rtsp_url so post_save can detect changes."""
    if not instance.pk:
        instance._rtsp_was = ""
        return
    try:
        instance._rtsp_was = Camera.objects.get(pk=instance.pk).rtsp_url
    except Camera.DoesNotExist:
        instance._rtsp_was = ""


@receiver(post_save, sender=Camera)
def register_camera_stream(sender, instance: Camera, created: bool, **_):
    """Keep MediaMTX in sync with camera.rtsp_url.

    - newly set / changed RTSP → register (or patch) the pull path
    - cleared RTSP          → remove the path from MediaMTX
    - stream_url is recomputed lazily by the serializer's hls_url field
    """
    previous = getattr(instance, "_rtsp_was", "")

    if instance.rtsp_url:
        media_server.register(str(instance.id), instance.rtsp_url)
    elif previous:
        media_server.unregister(str(instance.id))


@receiver(post_delete, sender=Camera)
def unregister_camera_stream(sender, instance: Camera, **_):
    if instance.rtsp_url:
        media_server.unregister(str(instance.id))
