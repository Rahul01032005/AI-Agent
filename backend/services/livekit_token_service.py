from livekit.api import AccessToken, VideoGrant
from backend.config import settings

def generate_livekit_token(identity: str, room_name: str) -> str:
    api_key = settings.LIVEKIT_API_KEY
    api_secret = settings.LIVEKIT_API_SECRET
    
    if not api_key or not api_secret:
        raise ValueError("LIVEKIT_API_KEY or LIVEKIT_API_SECRET is not configured in backend.")
        
    token = AccessToken(api_key, api_secret)
    token.with_identity(identity)
    token.with_name(identity)
    
    # Add room join permission and metadata if required
    grant = VideoGrant(
        room_join=True,
        room=room_name,
        can_publish=True,
        can_subscribe=True,
        can_publish_data=True
    )
    token.with_grants(grant)
    
    return token.to_jwt()
