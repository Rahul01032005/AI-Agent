import subprocess
import logging
from livekit.agents import llm
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.app_launcher")

APP_MAPPING = {
    "chrome": "start chrome",
    "google chrome": "start chrome",
    "edge": "start msedge",
    "microsoft edge": "start msedge",
    "notepad": "notepad",
    "text editor": "notepad",
    "calculator": "calc",
    "calc": "calc",
    "file explorer": "explorer",
    "explorer": "explorer",
    "vs code": "code",
    "vscode": "code",
    "visual studio code": "code",
    "command prompt": "start cmd",
    "cmd": "start cmd",
    "powershell": "start powershell"
}

class AppLauncher:
    @llm.ai_callable(description="Open common Windows applications such as Chrome, Edge, Notepad, Calculator, VS Code, File Explorer, Command Prompt, or PowerShell.")
    def open_app(self, app_name: str) -> str:
        name_clean = app_name.lower().strip()
        logger.info(f"Requested opening app: {app_name}")
        
        # Flexibly match
        matched_cmd = None
        for key, cmd in APP_MAPPING.items():
            if key in name_clean or name_clean in key:
                matched_cmd = cmd
                app_name = key
                break
                
        if not matched_cmd:
            error_msg = f"Application '{app_name}' is not supported or not found. Supported apps: Chrome, Edge, Notepad, Calculator, File Explorer, VS Code, Command Prompt, PowerShell."
            log_tool_to_backend(
                tool_name="open_app",
                tool_input=app_name,
                tool_output="",
                status="failed",
                error_message=error_msg
            )
            return error_msg
            
        try:
            # Execute on Windows shell
            # Using cmd /c start or running the command directly
            if matched_cmd.startswith("start "):
                subprocess.Popen(matched_cmd, shell=True)
            else:
                subprocess.Popen([matched_cmd], shell=True)
                
            success_msg = f"Successfully launched {app_name}."
            log_tool_to_backend(
                tool_name="open_app",
                tool_input=app_name,
                tool_output=success_msg,
                status="success"
            )
            return success_msg
        except Exception as e:
            error_msg = f"Failed to open {app_name}: {str(e)}"
            log_tool_to_backend(
                tool_name="open_app",
                tool_input=app_name,
                tool_output="",
                status="failed",
                error_message=error_msg
            )
            return error_msg
