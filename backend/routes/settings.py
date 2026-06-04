from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from backend.database import get_db
from backend.models import Setting
from backend.schemas import SettingResponse, SettingUpdate
from backend.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULT_SETTINGS = [
    {
        "key": "SAFETY_MODE",
        "value": str(settings.SAFETY_MODE).lower(),
        "description": "If enabled, dangerous system commands will require confirmation from user."
    },
    {
        "key": "ALLOW_SYSTEM_CONTROL",
        "value": str(settings.ALLOW_SYSTEM_CONTROL).lower(),
        "description": "If enabled, allow commands that control the operating system (e.g. shutdown, restart)."
    },
    {
        "key": "ALLOW_FILE_WRITE",
        "value": str(settings.ALLOW_FILE_WRITE).lower(),
        "description": "If enabled, allow commands that create folders or write files."
    },
    {
        "key": "ALLOW_WEB_SEARCH",
        "value": str(settings.ALLOW_WEB_SEARCH).lower(),
        "description": "If enabled, allow searching the web for information."
    },
    {
        "key": "AI_PROVIDER",
        "value": settings.AI_PROVIDER,
        "description": "LLM model provider ('gemini' or 'openai')."
    }
]

def seed_settings_if_needed(db: Session):
    for default in DEFAULT_SETTINGS:
        exists = db.query(Setting).filter(Setting.key == default["key"]).first()
        if not exists:
            db_setting = Setting(
                key=default["key"],
                value=default["value"],
                description=default["description"]
            )
            db.add(db_setting)
    db.commit()

@router.get("", response_model=List[SettingResponse])
def get_settings(db: Session = Depends(get_db)):
    seed_settings_if_needed(db)
    return db.query(Setting).all()

@router.post("/{key}", response_model=SettingResponse)
def update_setting(key: str, setting_data: SettingUpdate, db: Session = Depends(get_db)):
    seed_settings_if_needed(db)
    db_setting = db.query(Setting).filter(Setting.key == key).first()
    if not db_setting:
        raise HTTPException(status_code=404, detail=f"Setting key '{key}' not found.")
    
    # Update value
    db_setting.value = setting_data.value
    db.commit()
    db.refresh(db_setting)
    return db_setting
