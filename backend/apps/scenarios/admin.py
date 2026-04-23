from django.contrib import admin

from .models import TestScenario


@admin.register(TestScenario)
class TestScenarioAdmin(admin.ModelAdmin):
    list_display = ("name", "site", "validation_type", "category", "dut_type",
                    "ai_case", "collected_at", "row_count")
    list_filter = ("validation_type", "category", "site")
    search_fields = ("name",)
    autocomplete_fields = ("site", "source_dut")
