import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from backend.database import Base

class Command(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    user_text = Column(Text, nullable=False)
    agent_response = Column(Text, nullable=True)
    tool_name = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False) # e.g., "success", "failed", "pending_confirmation"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class ToolLog(Base):
    __tablename__ = "tool_logs"

    id = Column(Integer, primary_key=True, index=True)
    tool_name = Column(String(100), nullable=False)
    input = Column(Text, nullable=True)
    output = Column(Text, nullable=True)
    status = Column(String(50), nullable=False) # "success", "failed", "denied"
    error_message = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String(100), nullable=False)
    participant_identity = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
