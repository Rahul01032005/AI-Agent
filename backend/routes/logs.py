from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import ToolLog
from backend.schemas import ToolLogCreate, ToolLogResponse
from backend.services.logger_service import log_tool_execution

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.get("", response_model=List[ToolLogResponse])
def get_logs(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(ToolLog).order_by(ToolLog.timestamp.desc()).limit(limit).all()

@router.post("", response_model=ToolLogResponse)
def create_log(log_data: ToolLogCreate, db: Session = Depends(get_db)):
    return log_tool_execution(db, log_data)
