import uuid

from django.db import models


class Site(models.Model):
    class Region(models.TextChoices):
        DOMESTIC = "domestic", "國內"
        INTERNATIONAL = "international", "國外"

    class Environment(models.TextChoices):
        INDOOR = "indoor", "室內"
        OUTDOOR = "outdoor", "室外"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    region = models.CharField(max_length=32, choices=Region.choices)
    environment = models.CharField(
        max_length=16, choices=Environment.choices, default=Environment.INDOOR,
    )
    address = models.CharField(max_length=500, blank=True)
    location = models.JSONField(null=True, blank=True)
    floor_plan_url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["region"])]
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.name


class BaseStation(models.Model):
    class NodeType(models.TextChoices):
        GNB = "gnb", "gNB"
        SMO = "smo", "SMO"
        RIC = "ric", "RIC"

    class Status(models.TextChoices):
        NORMAL = "normal", "正常"
        WARNING = "warning", "需要關注"
        OFFLINE = "offline", "離線"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="stations")
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=200)
    node_type = models.CharField(max_length=16, choices=NodeType.choices)
    mgmt_ip = models.GenericIPAddressField(null=True, blank=True)
    mgmt_port = models.IntegerField(null=True, blank=True)
    vendor = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    config = models.JSONField(default=dict, blank=True)
    position = models.JSONField(default=dict)
    geo = models.JSONField(null=True, blank=True)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.NORMAL,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["site", "node_type"])]
        unique_together = (("site", "code"),)
        ordering = ("code",)

    def __str__(self) -> str:
        return f"{self.code} ({self.name})"


class Camera(models.Model):
    class Status(models.TextChoices):
        ONLINE = "online", "Online"
        OFFLINE = "offline", "Offline"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="cameras")
    name = models.CharField(max_length=200, blank=True)
    location = models.JSONField(null=True, blank=True)
    rtsp_url = models.CharField(max_length=500, blank=True)
    stream_url = models.CharField(max_length=500, blank=True)
    resolution = models.CharField(max_length=32, default="1920x1080")
    fps = models.IntegerField(default=30)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.OFFLINE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.name or str(self.id)


class TopologyLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.ForeignKey(
        BaseStation, on_delete=models.CASCADE, related_name="links_out",
    )
    target = models.ForeignKey(
        BaseStation, on_delete=models.CASCADE, related_name="links_in",
    )
    bandwidth = models.CharField(max_length=32, blank=True)
    latency_ms = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=16, default="normal")

    class Meta:
        indexes = [models.Index(fields=["source", "target"])]
        unique_together = (("source", "target"),)
