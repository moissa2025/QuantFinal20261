import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="sqlite:///app.db")
    ENV: str = "development"

    class Config:
        env_file = os.getenv("ENV_FILE", ".env.prod")
        case_sensitive = True

settings = Settings()
