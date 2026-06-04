import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base
from backend.routes import token, commands, logs, settings as settings_routes

# Create DB Tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AstraMind LiveKit AI Agent Backend",
    description="FastAPI backend for token generation, settings management, and log storage",
    version="1.0.0"
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For ease of development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(token.router)
app.include_router(commands.router)
app.include_router(logs.router)
app.include_router(settings_routes.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AstraMind LiveKit AI Agent API",
        "version": "1.0.0",
        "livekit_configured": bool(settings.LIVEKIT_API_KEY and settings.LIVEKIT_API_SECRET)
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }

@app.get("/system-info")
def get_system_info():
    import psutil
    import platform
    try:
        # Quick sample for instant telemetry
        cpu = psutil.cpu_percent(interval=0.1)
        ram = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        battery = psutil.sensors_battery()
        return {
            "os": f"{platform.system()} {platform.release()}",
            "cpu": cpu,
            "ram": ram,
            "disk": disk,
            "battery": battery.percent if battery else None,
            "battery_charging": battery.power_plugged if battery else None
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
