from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.validations.models import ValidationRun


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, run_id):
        run = get_object_or_404(ValidationRun, pk=run_id)
        return Response({"run_id": str(run.id), "report_url": run.report_url})
