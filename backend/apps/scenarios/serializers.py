from rest_framework import serializers

from .models import TestScenario


class TestScenarioSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source="site.name", read_only=True)
    site_region = serializers.CharField(source="site.region", read_only=True)
    site_location = serializers.JSONField(source="site.location", read_only=True)
    source_dut_name = serializers.CharField(source="source_dut.name", read_only=True)
    source_dut_type = serializers.CharField(source="source_dut.type", read_only=True)

    class Meta:
        model = TestScenario
        fields = (
            "id", "name",
            "site", "site_name", "site_region", "site_location",
            "source_dut", "source_dut_name", "source_dut_type",
            "validation_type", "dut_type", "ai_case", "category",
            "collected_at", "row_count",
            "description", "parameters", "created_at",
        )
        read_only_fields = (
            "id", "created_at",
            "site_name", "site_region", "site_location",
            "source_dut_name", "source_dut_type",
        )
