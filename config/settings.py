import os
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/insurance_db"
    APP_NAME: str = "Insurance Claim Management System"
    PORT: int = 8000
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_scheme(cls, v: str) -> str:
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    class Config:
        env_file = "insurance_service/.env"
        env_file_encoding = 'utf-8'

settings = Settings()
