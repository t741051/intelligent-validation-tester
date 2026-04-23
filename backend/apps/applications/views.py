from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Application
from .serializers import ApplicationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filterset_fields = ("type", "ai_case", "platform_type", "category", "vendor")
    search_fields = ("name", "vendor")
    ordering_fields = ("created_at",)

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    @action(detail=True, methods=["get"])
    def report(self, request, pk=None):
        app = self.get_object()
        return Response({"application_id": str(app.id), "report_url": ""})
