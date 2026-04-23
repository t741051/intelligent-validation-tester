from django.contrib import admin

from .models import Platform


@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "vendor", "version", "status", "submit_date")
    list_filter = ("type", "status", "vendor")
    search_fields = ("name", "vendor")
