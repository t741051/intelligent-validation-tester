from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import ValidationRun


class ValidationRunConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.run_id = str(self.scope["url_route"]["kwargs"]["run_id"])
        self.group_name = f"run_{self.run_id}"
        user = self.scope.get("user")
        if user is None or user.is_anonymous or not await self._can_view(user):
            await self.close(code=4003)
            return
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    @database_sync_to_async
    def _can_view(self, user) -> bool:
        return ValidationRun.objects.filter(id=self.run_id).exists()

    async def run_progress(self, event):
        await self.send_json({"type": "progress", "payload": event["payload"]})

    async def run_log(self, event):
        await self.send_json({"type": "log", "payload": event["payload"]})

    async def run_metric(self, event):
        await self.send_json({"type": "metric", "payload": event["payload"]})

    async def run_completed(self, event):
        await self.send_json({"type": "completed", "payload": event["payload"]})
        await self.close()
