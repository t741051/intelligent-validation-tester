from rest_framework.routers import DefaultRouter

from .views import ValidationRunViewSet

router = DefaultRouter()
router.register("validation-runs", ValidationRunViewSet, basename="validation-run")
urlpatterns = router.urls
