from django.urls import path

from .consumers import ValidationRunConsumer

websocket_urlpatterns = [
    path("ws/runs/<uuid:run_id>/", ValidationRunConsumer.as_asgi()),
]
