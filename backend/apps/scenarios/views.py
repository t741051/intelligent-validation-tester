from rest_framework import viewsets

from .models import TestScenario
from .serializers import TestScenarioSerializer


class TestScenarioViewSet(viewsets.ModelViewSet):
    queryset = TestScenario.objects.select_related("site", "source_dut").all()
    serializer_class = TestScenarioSerializer
    filterset_fields = ("validation_type", "category", "dut_type", "ai_case", "site")
    search_fields = ("name",)
