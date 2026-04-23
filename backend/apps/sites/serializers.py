from rest_framework import serializers

from .models import BaseStation, Camera, Site, TopologyLink


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = (
            "id", "name", "region", "environment",
            "address", "location", "floor_plan_url", "created_at",
        )
        read_only_fields = ("id", "created_at")


class BaseStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseStation
        fields = (
            "id", "site", "code", "name", "node_type",
            "mgmt_ip", "mgmt_port", "vendor", "model", "config",
            "position", "geo", "status", "created_at",
        )
        read_only_fields = ("id", "created_at")


class CameraSerializer(serializers.ModelSerializer):
    hls_url = serializers.SerializerMethodField()

    class Meta:
        model = Camera
        fields = (
            "id", "site", "name", "location", "rtsp_url", "stream_url", "hls_url",
            "resolution", "fps", "status", "created_at",
        )
        read_only_fields = ("id", "status", "hls_url", "created_at")

    def get_hls_url(self, obj):
        """Browser-playable HLS URL. If the camera has an RTSP source, return
        the MediaMTX-proxied URL; otherwise fall back to stream_url if set."""
        from . import media_server

        if obj.rtsp_url:
            return media_server.public_stream_url(str(obj.id))
        return obj.stream_url or None


class TopologyLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopologyLink
        fields = ("id", "source", "target", "bandwidth", "latency_ms", "status")
        read_only_fields = ("id",)


class TopologySerializer(serializers.Serializer):
    """Read-only composite view: stations + links for a site."""
    stations = BaseStationSerializer(many=True)
    links = TopologyLinkSerializer(many=True)


class TopologyLinkInputSerializer(serializers.Serializer):
    source = serializers.UUIDField()
    target = serializers.UUIDField()
    bandwidth = serializers.CharField(required=False, allow_blank=True)
    latency_ms = serializers.FloatField(required=False, allow_null=True)
    status = serializers.CharField(required=False)


class TopologyPatchSerializer(serializers.Serializer):
    """Batch replacement for a site's topology links (used by 編輯拓樸)."""
    links = TopologyLinkInputSerializer(many=True)
