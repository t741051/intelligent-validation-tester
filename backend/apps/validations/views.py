from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ValidationRun
from .serializers import StartRunInputSerializer, ValidationRunSerializer
from .services import ValidationService


class ValidationRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ValidationRun.objects.select_related("scenario", "triggered_by").all()
    serializer_class = ValidationRunSerializer
    filterset_fields = ("status", "target_type", "target_id", "scenario")
    ordering_fields = ("started_at", "ended_at", "score")

    def create(self, request):
        serializer = StartRunInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        run = ValidationService.start_run(
            scenario_id=serializer.validated_data.get("scenario_id"),
            target_type=serializer.validated_data["target_type"],
            target_id=serializer.validated_data["target_id"],
            user=request.user,
        )
        return Response(ValidationRunSerializer(run).data, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        run = ValidationService.cancel_run(pk, request.user)
        return Response(ValidationRunSerializer(run).data)
