from rest_framework import serializers

from .models import Platform


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ("id", "name", "type", "vendor", "version", "category",
                  "ai_cases", "endpoint", "submitted_by", "submit_date", "status")
        read_only_fields = ("id", "submitted_by", "submit_date", "status")
