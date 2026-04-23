from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "role", "must_change_password")
        read_only_fields = fields


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs["identifier"]
        user = (
            User.objects.filter(email__iexact=identifier).first()
            or User.objects.filter(username__iexact=identifier).first()
        )
        if user is None:
            raise serializers.ValidationError({"identifier": "帳號或密碼錯誤"})

        authenticated = authenticate(
            self.context.get("request"), email=user.email, password=attrs["password"]
        )
        if authenticated is None:
            raise serializers.ValidationError({"identifier": "帳號或密碼錯誤"})

        refresh = RefreshToken.for_user(authenticated)
        refresh["role"] = authenticated.role
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(authenticated).data,
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
