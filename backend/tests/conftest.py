import pytest


@pytest.fixture
def admin_user(db, django_user_model):
    return django_user_model.objects.create_superuser(
        email="admin@ivt.local",
        username="admin",
        password="admin123",
    )
