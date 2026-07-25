"""Minimal SMTP sender for transactional email (password resets).

If `SMTP_HOST` is not configured the message is logged instead of sent, so the
API stays functional before mail credentials are added on the server.
"""

import logging
import smtplib
from email.message import EmailMessage

from .config import get_settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str) -> bool:
    """Returns True when the message was handed to an SMTP server."""
    settings = get_settings()
    if not settings.smtp_host:
        logger.warning(
            "SMTP not configured — email to %s not sent. Subject: %s\n%s", to, subject, body
        )
        return False

    message = EmailMessage()
    message["From"] = settings.smtp_from or settings.smtp_user
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
        return True
    except Exception:  # noqa: BLE001 — never let mail failures break the request
        logger.exception("Failed to send email to %s", to)
        return False
