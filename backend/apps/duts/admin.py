from django.contrib import admin

from .models import DataQualityBaseline, Dut


@admin.register(Dut)
class DutAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "status", "site", "last_check")
    list_filter = ("type", "status", "site__environment", "site__region")
    search_fields = ("name", "endpoint")
    readonly_fields = ("id", "status", "last_check", "created_at")
    fieldsets = (
        ("基本資訊", {"fields": ("id", "site", "name", "type")}),
        ("連線", {"fields": ("endpoint", "interfaces", "status",
                             "response_time_ms", "last_check")}),
        ("系統", {"fields": ("created_at",)}),
    )


@admin.register(DataQualityBaseline)
class DataQualityBaselineAdmin(admin.ModelAdmin):
    list_display = ("dut", "test_category", "min_completeness", "min_accuracy",
                    "timeliness_max_lag_sec", "updated_at")
    list_filter = ("test_category",)
    search_fields = ("dut__name",)
    filter_horizontal = ("test_scenarios",)
