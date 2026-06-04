from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.schemas import TokenRequest, TokenResponse
from backend.services.livekit_token_service import generate_livekit_token
from backend.config import settings
from backend.database import get_db
from backend.models import Conversation

router = APIRouter(prefix="/token", tags=["Token"])

@router.post("", response_model=TokenResponse)
def get_token(request: TokenRequest, db: Session = Depends(get_db)):
    identity = request.identity
    room_name = request.room_name or settings.ROOM_NAME
    
    if not identity:
        raise HTTPException(status_code=400, detail="Identity is required")
        
    try:
        token = generate_livekit_token(identity, room_name)
        
        # Save conversation / connection details
        conv = Conversation(room_name=room_name, participant_identity=identity)
        db.add(conv)
        db.commit()
        
        return TokenResponse(
            token=token,
            livekit_url=settings.LIVEKIT_URL,
            room_name=room_name
        )
    except ValueError as ve:
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate token: {str(e)}")
