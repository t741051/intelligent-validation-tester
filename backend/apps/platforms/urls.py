from rest_framework.routers import DefaultRouter

from .views import PlatformViewSet

router = DefaultRouter()
router.register("platforms", PlatformViewSet, basename="platform")
urlpatterns = router.urls
