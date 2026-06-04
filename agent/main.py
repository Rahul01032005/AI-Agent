import asyncio
import logging
import os
import sys
from pathlib import Path

# Add venv DLL directories to search path for Windows compatibility
if os.name == "nt":
    venv_path = Path(__file__).resolve().parent / "venv"
    if venv_path.exists():
        os.add_dll_directory(str(venv_path))
        os.add_dll_directory(str(venv_path / "Scripts"))

# Add parent directory to sys.path to allow absolute imports under agent package
sys.path.append(str(Path(__file__).resolve().parent.parent))
import requests
import pathlib
from livekit.agents import JobContext, JobRequest, WorkerOptions, worker, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import google, openai, silero

from agent.config import config
from agent.tools import safety
from agent.utils import confirmation
from agent.utils.logger import log_command_to_backend, log_tool_to_backend
from agent.tools.app_launcher import AppLauncher
from agent.tools.browser_tools import BrowserTools
from agent.tools.web_search import WebSearch
from agent.tools.file_manager import FileManager
from agent.tools.system_info import SystemInfo
from agent.tools.system_control import SystemControl
from agent.tools.cognitive_tools import CognitiveTools

# Setup Logging
logger = logging.getLogger("astramind.agent")

class AstraMindFunctionContext(llm.FunctionContext):
    def __init__(self):
        super().__init__()
        self._launcher = AppLauncher()
        self._browser = BrowserTools()
        self._search = WebSearch()
        self._file = FileManager()
        self._sysinfo = SystemInfo()
        self._syscontrol = SystemControl()
        self._cognitive = CognitiveTools()

    @llm.ai_callable(description="Open common Windows applications such as Chrome, Notepad, Calculator, VS Code, File Explorer, Command Prompt, or PowerShell.")
    def open_app(self, app_name: str) -> str:
        return self._launcher.open_app(app_name)

    @llm.ai_callable(description="Open website URLs in the default browser.")
    def open_website(self, url_or_name: str) -> str:
        return self._browser.open_website(url_or_name)

    @llm.ai_callable(description="Search the web for real-time information.")
    def web_search(self, query: str) -> str:
        return self._search.web_search(query)

    @llm.ai_callable(description="Compare two items (e.g. Gemini vs OpenAI, Python vs Java) and output a comparison table.")
    def compare_items(self, item1: str, item2: str) -> str:
        return self._cognitive.compare_items(item1, item2)

    @llm.ai_callable(description="Create a text file inside the workspace.")
    def create_file(self, filename: str, content: str) -> str:
        return self._file.create_file(filename, content)

    @llm.ai_callable(description="Read a text file inside the workspace.")
    def read_file(self, filename: str) -> str:
        return self._file.read_file(filename)

    @llm.ai_callable(description="Create a new folder in the workspace.")
    def create_folder(self, folder_name: str) -> str:
        return self._file.create_folder(folder_name)

    @llm.ai_callable(description="Get system information (CPU, RAM, Disk usage, battery).")
    def system_info(self) -> str:
        return self._sysinfo.system_info()

    @llm.ai_callable(description="Shutdown the Windows laptop computer after user confirmation.")
    def shutdown_system(self) -> str:
        return self._syscontrol.shutdown_system()

    @llm.ai_callable(description="Restart the Windows laptop computer after user confirmation.")
    def restart_system(self) -> str:
        return self._syscontrol.restart_system()

    @llm.ai_callable(description="Summarize a long text concisely.")
    def summarize_text(self, text: str) -> str:
        return self._cognitive.summarize_text(text)

    @llm.ai_callable(description="Decide which tool to use based on the user request text.")
    def command_router(self, user_text: str) -> str:
        return self._cognitive.command_router(user_text)

# Helper to fetch settings
def get_backend_settings():
    try:
        resp = requests.get(f"{config.BACKEND_URL}/settings", timeout=2)
        if resp.status_code == 200:
            return {item["key"]: item["value"] for item in resp.json()}
    except Exception as e:
        logger.warning(f"Failed to fetch backend settings: {e}")
    return {}

# Main job entrypoint
async def entrypoint(ctx: JobContext):
    logger.info(f"Starting agent job context for room: {ctx.room.name}")
    
    # Read system prompt
    prompt_file = pathlib.Path(__file__).parent / "prompts" / "system_prompt.txt"
    try:
        with open(prompt_file, "r", encoding="utf-8") as f:
            system_prompt = f.read()
    except Exception:
        system_prompt = "You are AstraMind, a helpful real-time AI assistant."
        
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=system_prompt
    )
    
    # Configure LLM based on backend settings
    settings_db = get_backend_settings()
    provider = settings_db.get("AI_PROVIDER", config.AI_PROVIDER).lower()
    
    # Build LLM
    if provider == "openai":
        logger.info("Using OpenAI LLM provider.")
        llm_model = openai.LLM()
    else:
        logger.info("Using Gemini LLM provider.")
        llm_model = google.LLM(model=config.GEMINI_MODEL)
        
    # Function calling context
    fnc_ctx = AstraMindFunctionContext()
    
    # Define VAD, STT, LLM, TTS
    agent = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=llm_model,
        tts=openai.TTS(),
        chat_ctx=initial_ctx,
        fnc_ctx=fnc_ctx
    )
    
    # Join connection
    await ctx.connect(prewarm=True)
    logger.info("Joined LiveKit room.")
    
    # Session-level tracking for logging
    session_state = {
        "last_user_text": "",
        "active_tool": None
    }
    
    @agent.on("user_speech_committed")
    def on_user_speech(msg: llm.ChatMessage):
        user_text = msg.content
        logger.info(f"User Spoke: {user_text}")
        session_state["last_user_text"] = user_text
        
        # Check and handle safety confirmations
        if safety.get_pending_action():
            safety.confirm_pending_action(user_text)

    @agent.on("agent_speech_committed")
    def on_agent_speech(msg: llm.ChatMessage):
        agent_resp = msg.content
        logger.info(f"Agent Replied: {agent_resp}")
        user_text = session_state.get("last_user_text") or "Speech/Sound detected"
        
        # Log voice exchange to backend DB
        log_command_to_backend(
            user_text=user_text,
            agent_response=agent_resp,
            status="success"
        )
        
    agent.start(ctx.room)
    logger.info("VoiceAssistant started.")
    
    # Startup greeting
    await agent.say("Hello Rahul, AstraMind is online. How can I assist you with your laptop today?")

if __name__ == "__main__":
    # Start LiveKit Agent worker
    worker.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
