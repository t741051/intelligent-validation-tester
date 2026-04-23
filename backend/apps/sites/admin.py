from django.contrib import admin

from .models import BaseStation, Site, TopologyLink


class BaseStationInline(admin.TabularInline):
    model = BaseStation
    extra = 0
    fields = ("code", "name", "node_type", "status", "position", "geo")
    show_change_link = True


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "environment", "address", "created_at")
    list_filter = ("region", "environment")
    search_fields = ("name", "address")
    inlines = (BaseStationInline,)


@admin.register(BaseStation)
class BaseStationAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "site", "node_type", "mgmt_ip",
                    "vendor", "status", "created_at")
    list_filter = ("node_type", "status", "site", "vendor")
    search_fields = ("code", "name", "mgmt_ip")
    ordering = ("site", "code")


@admin.register(TopologyLink)
class TopologyLinkAdmin(admin.ModelAdmin):
    list_display = ("source", "target", "bandwidth", "latency_ms", "status")
    list_filter = ("status",)
    autocomplete_fields = ("source", "target")
