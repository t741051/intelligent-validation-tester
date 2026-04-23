class ReportService:
    """Skeleton for WeasyPrint → MinIO upload. Returns a signed URL.

    Real implementation renders `templates/report.html` with run context,
    uploads the PDF to MinIO, and returns a 7-day signed URL.
    """

    @staticmethod
    def generate(run) -> str:
        return ""
