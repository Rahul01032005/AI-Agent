import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load env from parent or local path
root_dir = Path(__file__).resolve().parent.parent
dotenv_path = root_dir / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    load_dotenv()

class Settings(BaseSettings):
    LIVEKIT_URL: str = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY: str = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET: str = os.getenv("LIVEKIT_API_SECRET", "")
    
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    DATABASE_URL: str = "sqlite:///./astramind.db"
    
    ROOM_NAME: str = os.getenv("ROOM_NAME", "astramind-room")
    AGENT_NAME: str = os.getenv("AGENT_NAME", "AstraMind")
    
    SAFETY_MODE: bool = os.getenv("SAFETY_MODE", "true").lower() == "true"
    ALLOW_SYSTEM_CONTROL: bool = os.getenv("ALLOW_SYSTEM_CONTROL", "true").lower() == "true"
    ALLOW_FILE_WRITE: bool = os.getenv("ALLOW_FILE_WRITE", "true").lower() == "true"
    ALLOW_WEB_SEARCH: bool = os.getenv("ALLOW_WEB_SEARCH", "true").lower() == "true"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
