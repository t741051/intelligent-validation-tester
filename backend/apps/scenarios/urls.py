from rest_framework.routers import DefaultRouter

from .views import TestScenarioViewSet

router = DefaultRouter()
router.register("scenarios", TestScenarioViewSet, basename="scenario")
urlpatterns = router.urls
