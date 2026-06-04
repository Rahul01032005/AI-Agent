import os
import logging
from pathlib import Path
from livekit.agents import llm
from agent.config import config
from agent.tools import safety
from agent.utils import confirmation
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.file_manager")

class FileManager:
    def _is_safe_path(self, path: Path) -> bool:
        """Helper to ensure paths are contained within the sandbox workspace folder."""
        try:
            workspace_resolved = config.WORKSPACE_DIR.resolve()
            path_resolved = path.resolve()
            # If the file doesn't exist yet, we check the parent directory
            if not path_resolved.exists():
                return workspace_resolved in path_resolved.parents
            return workspace_resolved in path_resolved.parents or path_resolved == workspace_resolved
        except Exception:
            return False

    @llm.ai_callable(description="Create a text file inside the safe workspace folder with the specified content.")
    def create_file(self, filename: str, content: str) -> str:
        logger.info(f"Requested creating file '{filename}'")
        
        if not config.ALLOW_FILE_WRITE:
            msg = "File writing is currently disabled by administrator settings."
            log_tool_to_backend("create_file", filename, msg, "denied")
            return msg

        workspace = config.ensure_workspace()
        target_path = (workspace / filename).resolve()
        
        # Check security boundaries
        if not self._is_safe_path(target_path):
            error_msg = f"Security Error: Access to path '{filename}' is denied. You can only create files inside the safe workspace."
            log_tool_to_backend("create_file", filename, "", "failed", error_msg)
            return error_msg

        # Check if file exists -> requires overwrite confirmation
        if target_path.exists():
            pending = safety.get_pending_action()
            expected_pending = f"overwrite_{filename}"
            
            if pending == expected_pending and confirmation.is_confirmed():
                # User has confirmed overwrite! Clear and continue
                safety.clear_pending_action()
            else:
                # Prompt for confirmation
                msg = safety.require_confirmation(expected_pending)
                log_tool_to_backend("create_file", filename, "Confirmation required for overwrite", "pending_confirmation")
                return f"File '{filename}' already exists. {msg}"

        try:
            # Create parent dirs if necessary
            target_path.parent.mkdir(parents=True, exist_ok=True)
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(content)
                
            success_msg = f"Successfully created file '{filename}' in the workspace."
            log_tool_to_backend("create_file", filename, success_msg, "success")
            return success_msg
        except Exception as e:
            error_msg = f"Failed to create file: {str(e)}"
            log_tool_to_backend("create_file", filename, "", "failed", error_msg)
            return error_msg

    @llm.ai_callable(description="Read the contents of a text file inside the safe workspace folder.")
    def read_file(self, filename: str) -> str:
        logger.info(f"Requested reading file '{filename}'")
        workspace = config.ensure_workspace()
        target_path = (workspace / filename).resolve()

        if not self._is_safe_path(target_path):
            error_msg = f"Security Error: Access to path '{filename}' is denied. You can only read files inside the safe workspace."
            log_tool_to_backend("read_file", filename, "", "failed", error_msg)
            return error_msg

        if not target_path.exists() or not target_path.is_file():
            error_msg = f"File '{filename}' not found."
            log_tool_to_backend("read_file", filename, "", "failed", error_msg)
            return error_msg

        try:
            with open(target_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Summarize if long
            if len(content) > 500:
                summary = content[:500] + "\n... [truncated - file content exceeds 500 characters]"
                msg = f"Content of '{filename}' (summarized):\n\n{summary}"
            else:
                msg = f"Content of '{filename}':\n\n{content}"
                
            log_tool_to_backend("read_file", filename, msg[:1000], "success")
            return msg
        except Exception as e:
            error_msg = f"Failed to read file: {str(e)}"
            log_tool_to_backend("read_file", filename, "", "failed", error_msg)
            return error_msg

    @llm.ai_callable(description="Create a new subfolder/directory inside the safe workspace folder.")
    def create_folder(self, folder_name: str) -> str:
        logger.info(f"Requested creating folder '{folder_name}'")
        
        if not config.ALLOW_FILE_WRITE:
            msg = "File and folder creation is currently disabled by administrator settings."
            log_tool_to_backend("create_folder", folder_name, msg, "denied")
            return msg

        workspace = config.ensure_workspace()
        target_path = (workspace / folder_name).resolve()

        if not self._is_safe_path(target_path):
            error_msg = f"Security Error: Access to path '{folder_name}' is denied. You can only create folders inside the safe workspace."
            log_tool_to_backend("create_folder", folder_name, "", "failed", error_msg)
            return error_msg

        if target_path.exists():
            msg = f"Folder or file with the name '{folder_name}' already exists."
            log_tool_to_backend("create_folder", folder_name, msg, "failed")
            return msg

        try:
            target_path.mkdir(parents=True, exist_ok=True)
            success_msg = f"Successfully created folder '{folder_name}' in the workspace."
            log_tool_to_backend("create_folder", folder_name, success_msg, "success")
            return success_msg
        except Exception as e:
            error_msg = f"Failed to create folder: {str(e)}"
            log_tool_to_backend("create_folder", folder_name, "", "failed", error_msg)
            return error_msg
