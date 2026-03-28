import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/insurance_db"
    APP_NAME: str = "Insurance Claim Management System"
    PORT: int = 8000
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    class Config:
        env_file = "insurance_service/.env"
        env_file_encoding = 'utf-8'

settings = Settings()
