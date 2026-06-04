from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Command
from backend.schemas import CommandCreate, CommandResponse
from backend.services.logger_service import log_command

router = APIRouter(prefix="/commands", tags=["Commands"])

@router.get("", response_model=List[CommandResponse])
def get_commands(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Command).order_by(Command.timestamp.desc()).limit(limit).all()

@router.post("", response_model=CommandResponse)
def create_command(command_data: CommandCreate, db: Session = Depends(get_db)):
    return log_command(db, command_data)
