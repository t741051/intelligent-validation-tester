from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ("id", "name", "type", "platform_type", "ai_case", "category",
                  "vendor", "version", "endpoint", "intelligence_score",
                  "submitted_by", "created_at")
        read_only_fields = ("id", "submitted_by", "intelligence_score", "created_at")
