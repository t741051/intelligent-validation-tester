from rest_framework.routers import DefaultRouter

from .views import DutViewSet

router = DefaultRouter()
router.register("dut", DutViewSet, basename="dut")
urlpatterns = router.urls
