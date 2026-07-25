from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "mysql+pymysql://root:root@localhost:3306/emperical"
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 1440
    cors_origins: str = "http://localhost:3000"
    admin_email: str = "admin@empericalpublication.com"
    admin_password: str = "Admin@123"

    # Public site URL — used in password-reset links.
    site_url: str = "http://localhost:3000"

    # Manuscript uploads
    upload_dir: str = "uploads"
    max_upload_mb: int = 25

    # Optional SMTP for password-reset emails. When smtp_host is blank the
    # reset token is still created and logged, but no email is sent.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_use_tls: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
