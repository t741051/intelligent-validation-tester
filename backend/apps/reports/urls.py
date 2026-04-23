from django.urls import path

from .views import ReportView

urlpatterns = [
    path("<uuid:run_id>/", ReportView.as_view(), name="report-detail"),
]
