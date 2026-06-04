from livekit.api import AccessToken, VideoGrants
from backend.config import settings


def generate_livekit_token(identity: str, room_name: str) -> str:
    token = (
        AccessToken(
            settings.LIVEKIT_API_KEY,
            settings.LIVEKIT_API_SECRET,
        )
        .with_identity(identity)
        .with_grants(
            VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
                can_publish_data=True,
            )
        )
    )

    return token.to_jwt()
