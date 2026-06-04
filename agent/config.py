import os
from pathlib import Path
from dotenv import load_dotenv

# Load from parent folder if exists, or local
root_dir = Path(__file__).resolve().parent.parent
dotenv_path = root_dir / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    load_dotenv()

class AgentConfig:
    LIVEKIT_URL = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "")
    
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini")
    
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    ROOM_NAME = os.getenv("ROOM_NAME", "astramind-room")
    AGENT_NAME = os.getenv("AGENT_NAME", "AstraMind")
    
    SAFETY_MODE = os.getenv("SAFETY_MODE", "true").lower() == "true"
    ALLOW_SYSTEM_CONTROL = os.getenv("ALLOW_SYSTEM_CONTROL", "true").lower() == "true"
    ALLOW_FILE_WRITE = os.getenv("ALLOW_FILE_WRITE", "true").lower() == "true"
    ALLOW_WEB_SEARCH = os.getenv("ALLOW_WEB_SEARCH", "true").lower() == "true"
    
    # Safe workspace is the project directory root or subfolder
    WORKSPACE_DIR = root_dir / "workspace"
    
    @classmethod
    def ensure_workspace(cls):
        cls.WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
        return cls.WORKSPACE_DIR

config = AgentConfig
config.ensure_workspace()
print(f"[AgentConfig] Workspace set to: {config.WORKSPACE_DIR}")
