from rest_framework import serializers

from .models import ValidationRun


class ValidationRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationRun
        fields = ("id", "scenario", "target_type", "target_id", "status",
                  "progress", "started_at", "ended_at", "score", "report_url",
                  "triggered_by")
        read_only_fields = ("id", "status", "progress", "started_at",
                            "ended_at", "score", "report_url", "triggered_by")


class StartRunInputSerializer(serializers.Serializer):
    scenario_id = serializers.UUIDField(required=False, allow_null=True)
    target_type = serializers.ChoiceField(choices=ValidationRun.TargetType.choices)
    target_id = serializers.UUIDField()
