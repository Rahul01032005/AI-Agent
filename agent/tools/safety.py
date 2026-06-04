import logging
from agent.utils import confirmation
from agent.config import config

logger = logging.getLogger("astramind.safety")

DANGEROUS_ACTIONS = [
    "shutdown",
    "restart",
    "delete",
    "overwrite",
    "terminal command",
    "close app",
    "system modification"
]

def is_dangerous_action(action_name: str) -> bool:
    """Check if the given action name is in the list of dangerous actions."""
    name = action_name.lower()
    return any(item in name for item in DANGEROUS_ACTIONS)

def require_confirmation(action_name: str) -> str:
    """
    Sets the pending action and returns the confirmation prompt.
    This prompt should be spoken to the user.
    """
    confirmation.set_pending_action(action_name)
    return f"This action needs confirmation. Please say confirm {action_name} to proceed."

def confirm_pending_action(user_text: str) -> bool:
    """Check if the user utterance confirms the current pending action."""
    return confirmation.check_confirmation(user_text)

def clear_pending_action():
    """Reset the confirmation state."""
    confirmation.clear_pending_action()

def get_pending_action() -> str:
    """Retrieve the current pending action."""
    return confirmation.get_pending_action()
