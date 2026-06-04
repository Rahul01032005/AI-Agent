from sqlalchemy.orm import Session
from backend.models import Command, ToolLog
from backend.schemas import CommandCreate, ToolLogCreate

def log_command(db: Session, command_data: CommandCreate) -> Command:
    db_command = Command(
        user_text=command_data.user_text,
        agent_response=command_data.agent_response,
        tool_name=command_data.tool_name,
        status=command_data.status
    )
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    return db_command

def log_tool_execution(db: Session, tool_data: ToolLogCreate) -> ToolLog:
    db_log = ToolLog(
        tool_name=tool_data.tool_name,
        input=tool_data.input,
        output=tool_data.output,
        status=tool_data.status,
        error_message=tool_data.error_message
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
