"""RBAC helpers — minimal base-version (admin / viewer) per 01 doc decision #5."""
from rest_framework.permissions import BasePermission

ROLE_PERMISSIONS: dict[str, set[str]] = {
    "admin": {"*"},
    "platform_vendor": {"platform:*", "dut:*", "validation:run", "report:read"},
    "app_vendor": {"application:*", "validation:run", "report:read"},
    "viewer": {"*:read"},
}


def has_permission_for(role: str, permission: str) -> bool:
    perms = ROLE_PERMISSIONS.get(role, set())
    if "*" in perms:
        return True
    resource, action = permission.split(":")
    return (
        permission in perms
        or f"{resource}:*" in perms
        or f"*:{action}" in perms
    )


class HasPermission(BasePermission):
    """Usage: permission_classes = [HasPermission('dut:write')] via factory.

    DRF instantiates permission classes with no args, so we use a closure.
    """

    required = ""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return has_permission_for(getattr(request.user, "role", "viewer"), self.required)


def require(permission: str) -> type[HasPermission]:
    """Return a subclass of HasPermission bound to `permission`."""
    return type(
        "HasPermission_" + permission.replace(":", "_"),
        (HasPermission,),
        {"required": permission},
    )
