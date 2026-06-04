import subprocess
import logging
from livekit.agents import llm
from agent.config import config
from agent.tools import safety
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.system_control")

class SystemControl:
    @llm.ai_callable(description="Shutdown the local Windows computer. This action requires explicit confirmation.")
    def shutdown_system(self) -> str:
        logger.info("Requested system shutdown.")
        
        if not config.ALLOW_SYSTEM_CONTROL:
            msg = "System power control is currently disabled by administrator settings."
            log_tool_to_backend("shutdown_system", "execute", msg, "denied")
            return msg

        pending = safety.get_pending_action()
        if pending == "shutdown" and confirmation.is_confirmed():
            # Confirmed! Run shutdown on Windows. 
            # We schedule a shutdown in 60 seconds with a message so the user has time to cancel it via 'shutdown /a' if they wish.
            try:
                subprocess.Popen("shutdown /s /t 60 /c \"AstraMind initiated system shutdown. Run 'shutdown /a' in Command Prompt to abort.\"", shell=True)
                safety.clear_pending_action()
                msg = "Shutdown command scheduled for 60 seconds from now. To abort, open cmd and type 'shutdown /a'."
                log_tool_to_backend("shutdown_system", "execute", msg, "success")
                return msg
            except Exception as e:
                error_msg = f"Failed to execute shutdown command: {str(e)}"
                log_tool_to_backend("shutdown_system", "execute", "", "failed", error_msg)
                return error_msg
        else:
            # Set confirmation requirement
            msg = safety.require_confirmation("shutdown")
            log_tool_to_backend("shutdown_system", "execute", "Confirmation required", "pending_confirmation")
            return msg

    @llm.ai_callable(description="Restart the local Windows computer. This action requires explicit confirmation.")
    def restart_system(self) -> str:
        logger.info("Requested system restart.")
        
        if not config.ALLOW_SYSTEM_CONTROL:
            msg = "System power control is currently disabled by administrator settings."
            log_tool_to_backend("restart_system", "execute", msg, "denied")
            return msg

        pending = safety.get_pending_action()
        if pending == "restart" and confirmation.is_confirmed():
            # Confirmed! Run restart on Windows
            # Schedule in 60 seconds
            try:
                subprocess.Popen("shutdown /r /t 60 /c \"AstraMind initiated system restart. Run 'shutdown /a' in Command Prompt to abort.\"", shell=True)
                safety.clear_pending_action()
                msg = "Restart command scheduled for 60 seconds from now. To abort, open cmd and type 'shutdown /a'."
                log_tool_to_backend("restart_system", "execute", msg, "success")
                return msg
            except Exception as e:
                error_msg = f"Failed to execute restart command: {str(e)}"
                log_tool_to_backend("restart_system", "execute", "", "failed", error_msg)
                return error_msg
        else:
            # Set confirmation requirement
            msg = safety.require_confirmation("restart")
            log_tool_to_backend("restart_system", "execute", "Confirmation required", "pending_confirmation")
            return msg
