from .base import *  # noqa: F401,F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
USE_MOCK_CONNECTORS = True
CELERY_TASK_ALWAYS_EAGER = True
