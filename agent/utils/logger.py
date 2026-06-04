import requests
import logging
from agent.config import config

# Setup local console logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("astramind.agent")

def log_command_to_backend(user_text: str, agent_response: str, tool_name: str = None, status: str = "success"):
    """Posts a voice command run to the FastAPI backend database."""
    try:
        url = f"{config.BACKEND_URL}/commands"
        payload = {
            "user_text": user_text,
            "agent_response": agent_response,
            "tool_name": tool_name,
            "status": status
        }
        resp = requests.post(url, json=payload, timeout=3)
        if resp.status_code == 200:
            logger.info("Successfully logged command to backend.")
        else:
            logger.warning(f"Backend log command returned: {resp.status_code}")
    except Exception as e:
        logger.error(f"Failed to send command log to backend: {e}")

def log_tool_to_backend(tool_name: str, tool_input: str, tool_output: str, status: str, error_message: str = None):
    """Posts a tool execution event to the FastAPI backend database."""
    try:
        url = f"{config.BACKEND_URL}/logs"
        payload = {
            "tool_name": tool_name,
            "input": str(tool_input),
            "output": str(tool_output),
            "status": status,
            "error_message": error_message
        }
        resp = requests.post(url, json=payload, timeout=3)
        if resp.status_code == 200:
            logger.info(f"Successfully logged tool '{tool_name}' execution to backend.")
        else:
            logger.warning(f"Backend log tool returned: {resp.status_code}")
    except Exception as e:
        logger.error(f"Failed to send tool log to backend: {e}")
