from django.urls import path

from .views import OverviewSummaryView

urlpatterns = [
    path("summary/", OverviewSummaryView.as_view(), name="overview_summary"),
]
