from django.urls import path

from .views import ChangePasswordView, LoginView, MeView

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth_login"),
    path("me/", MeView.as_view(), name="auth_me"),
    path("change-password/", ChangePasswordView.as_view(), name="auth_change_password"),
]
