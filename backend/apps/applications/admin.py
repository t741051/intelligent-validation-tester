from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "ai_case", "vendor", "intelligence_score", "created_at")
    list_filter = ("type", "ai_case", "platform_type")
    search_fields = ("name", "vendor")
