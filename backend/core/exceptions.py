from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return None
    detail = response.data if isinstance(response.data, dict) else {"detail": response.data}
    message = str(detail.get("detail", exc))
    response.data = {
        "error": {
            "code": getattr(exc, "default_code", exc.__class__.__name__).upper(),
            "message": message,
            "details": detail,
        }
    }
    return response
