import webbrowser
import urllib.parse
import logging
from livekit.agents import llm
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.browser_tools")

WEBSITE_MAPPING = {
    "youtube": "https://www.youtube.com/",
    "google": "https://www.google.com/",
    "gmail": "https://mail.google.com/",
    "github": "https://github.com/",
    "linkedin": "https://www.linkedin.com/",
    "leetcode": "https://leetcode.com/",
    "chatgpt": "https://chatgpt.com/"
}

class BrowserTools:
    @llm.ai_callable(description="Open a website in the default browser by name (e.g. YouTube, Google, GitHub, LeetCode) or by direct URL.")
    def open_website(self, url_or_name: str) -> str:
        logger.info(f"Requested opening website: '{url_or_name}'")
        clean_input = url_or_name.lower().strip()
        
        # Check mapping
        target_url = None
        for key, url in WEBSITE_MAPPING.items():
            if key in clean_input or clean_input in key:
                target_url = url
                url_or_name = key
                break
                
        # If no mapping, check if it looks like a URL
        if not target_url:
            if clean_input.startswith("http://") or clean_input.startswith("https://") or "." in clean_input:
                target_url = url_or_name if clean_input.startswith(("http://", "https://")) else f"https://{url_or_name}"
            else:
                target_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(url_or_name)}"
                
        try:
            webbrowser.open(target_url)
            success_msg = f"Successfully opened {url_or_name} in your browser."
            log_tool_to_backend("open_website", url_or_name, success_msg, "success")
            return success_msg
        except Exception as e:
            error_msg = f"Failed to open website {url_or_name}: {str(e)}"
            log_tool_to_backend("open_website", url_or_name, "", "failed", error_msg)
            return error_msg
