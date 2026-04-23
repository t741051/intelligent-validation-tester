from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()


class AccountService:
    @staticmethod
    def change_password(user, old_password: str, new_password: str) -> None:
        if not user.check_password(old_password):
            raise ValidationError({"old_password": "incorrect"})
        user.set_password(new_password)
        user.must_change_password = False
        user.save(update_fields=["password", "must_change_password"])
