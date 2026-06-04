import logging

logger = logging.getLogger("astramind.confirmation")

_pending_action = None
_is_confirmed = False

def set_pending_action(action_name: str):
    global _pending_action, _is_confirmed
    _pending_action = action_name
    _is_confirmed = False
    logger.info(f"Set pending confirmation action: {action_name}")

def get_pending_action() -> str:
    global _pending_action
    return _pending_action

def clear_pending_action():
    global _pending_action, _is_confirmed
    logger.info(f"Cleared pending action: {_pending_action}")
    _pending_action = None
    _is_confirmed = False

def is_confirmed() -> bool:
    global _is_confirmed
    return _is_confirmed

def check_confirmation(user_text: str) -> bool:
    global _pending_action, _is_confirmed
    if not _pending_action:
        return False
    
    text = user_text.lower()
    # Check if user says "confirm", "yes", "do it", or mentions "confirm <action>"
    confirmed = (
        "confirm" in text or 
        "yes" in text or 
        "do it" in text or 
        "go ahead" in text or
        (_pending_action in text and "yes" in text) or
        ("confirm" in text and _pending_action.split("_")[0] in text)
    )
    
    if confirmed:
        _is_confirmed = True
        logger.info(f"Action '{_pending_action}' successfully confirmed by utterance: '{user_text}'")
        return True
    
    return False
