from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Token Schemas
class TokenRequest(BaseModel):
    identity: str = Field(..., description="Identity of the participant")
    room_name: Optional[str] = Field(None, description="Name of the LiveKit room")

class TokenResponse(BaseModel):
    token: str
    livekit_url: str
    room_name: str

# Command Schemas
class CommandCreate(BaseModel):
    user_text: str
    agent_response: Optional[str] = None
    tool_name: Optional[str] = None
    status: str

class CommandResponse(BaseModel):
    id: int
    user_text: str
    agent_response: Optional[str]
    tool_name: Optional[str]
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

# ToolLog Schemas
class ToolLogCreate(BaseModel):
    tool_name: str
    input: Optional[str] = None
    output: Optional[str] = None
    status: str
    error_message: Optional[str] = None

class ToolLogResponse(BaseModel):
    id: int
    tool_name: str
    input: Optional[str]
    output: Optional[str]
    status: str
    error_message: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

# Conversation Schemas
class ConversationCreate(BaseModel):
    room_name: str
    participant_identity: str

class ConversationResponse(BaseModel):
    id: int
    room_name: str
    participant_identity: str
    created_at: datetime

    class Config:
        from_attributes = True

# Settings Schemas
class SettingCreate(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingUpdate(BaseModel):
    value: str

class SettingResponse(BaseModel):
    id: int
    key: str
    value: str
    description: Optional[str]

    class Config:
        from_attributes = True
