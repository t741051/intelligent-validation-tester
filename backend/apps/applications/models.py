import uuid

from django.db import models


class Application(models.Model):
    class Type(models.TextChoices):
        XAPP = "xApp", "xApp"
        RAPP = "rApp", "rApp"

    AI_CASES = [
        ("CCO", "CCO"),
        ("ENERGY_SAVING", "Energy Saving"),
        ("NETWORK_OPT", "Network Optimization"),
        ("TRAFFIC_PREDICTION", "Traffic Prediction"),
        ("LOAD_BALANCING", "Load Balancing"),
        ("EDGE_COMPUTING", "Edge Computing"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=8, choices=Type.choices)
    platform_type = models.CharField(max_length=8)
    ai_case = models.CharField(max_length=64, choices=AI_CASES)
    category = models.CharField(max_length=32, blank=True)
    vendor = models.CharField(max_length=200)
    version = models.CharField(max_length=64)
    endpoint = models.URLField()
    intelligence_score = models.FloatField(null=True, blank=True)
    submitted_by = models.ForeignKey("accounts.User", on_delete=models.PROTECT,
                                      related_name="applications")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["type", "ai_case"])]
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.type}:{self.name}"
