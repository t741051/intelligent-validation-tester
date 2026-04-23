from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Platform
from .serializers import PlatformSerializer


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    filterset_fields = ("type", "status", "vendor")
    search_fields = ("name", "vendor")
    ordering_fields = ("submit_date",)

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    @action(detail=True, methods=["get"])
    def report(self, request, pk=None):
        platform = self.get_object()
        return Response({"platform_id": str(platform.id), "report_url": ""})
