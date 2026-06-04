import logging
from livekit.agents import llm
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.cognitive")

class CognitiveTools:
    @llm.ai_callable(description="Compare two items (e.g., Gemini vs OpenAI, React vs Angular, Python vs Java) and output a comparison table.")
    def compare_items(self, item1: str, item2: str) -> str:
        logger.info(f"Requested comparison: '{item1}' vs '{item2}'")
        
        # Simple structured template comparisons for common pairs
        key = f"{item1.lower()} vs {item2.lower()}"
        key_alt = f"{item2.lower()} vs {item1.lower()}"
        
        comparison = ""
        if "gemini" in key and "openai" in key:
            comparison = (
                "| Feature | Gemini API | OpenAI API |\n"
                "|---|---|---|\n"
                "| Context Window | Up to 2M tokens (Flash/Pro) | Up to 128k tokens (GPT-4o) |\n"
                "| Multimodality | Native audio/video/image | Image/Audio (some limitations) |\n"
                "| Cost | Highly cost-effective (Flash) | Premium pricing |\n"
                "| Speed | Extremely low latency | Medium latency |\n\n"
                "Verdict: Gemini is highly recommended for massive context and native real-time audio (perfect for AstraMind). OpenAI is strong for complex reasoning."
            )
        elif "python" in key and "java" in key:
            comparison = (
                "| Feature | Python | Java |\n"
                "|---|---|---|\n"
                "| Type System | Dynamic, interpreted | Static, compiled |\n"
                "| Syntax | Verbose-free, clean | Verbose, structured |\n"
                "| Ecosystem | AI, Data Science, Scripting | Enterprise Apps, Android |\n"
                "| Execution Speed | Slower (GIL/interpreted) | High (JVM) |\n\n"
                "Verdict: Choose Python for AI, fast scripting, and prototyping. Choose Java for enterprise architectures."
            )
        elif "react" in key and "angular" in key:
            comparison = (
                "| Feature | React | Angular |\n"
                "|---|---|---|\n"
                "| Core Type | UI Library (components) | Complete MVC Framework |\n"
                "| Data Binding | Unidirectional | Bi-directional |\n"
                "| Learning Curve | Medium | Steep |\n"
                "| Language | JS / TS | TypeScript-first |\n\n"
                "Verdict: React is best for flexible, simple component architecture. Angular is best for large-scale enterprise single-page applications."
            )
        else:
            # General fallback comparison
            comparison = (
                f"Comparison: {item1} vs {item2}\n\n"
                f"- **{item1}**: excels in specific developer workflows and flexibility.\n"
                f"- **{item2}**: excels in integration, stability, and enterprise adoption.\n\n"
                "Recommendation depends heavily on project constraints. For quick iteration, the former is preferred; for long-term scalability, the latter."
            )
            
        log_tool_to_backend("compare_items", f"{item1} vs {item2}", comparison, "success")
        return comparison

    @llm.ai_callable(description="Summarize a long passage of text concisely.")
    def summarize_text(self, text: str) -> str:
        logger.info(f"Requested text summarization of length {len(text)}")
        
        # Simple local summarization by taking key sentences or trimming
        clean_text = text.strip()
        sentences = [s.strip() for s in clean_text.split('.') if s.strip()]
        
        if len(sentences) <= 2:
            summary = clean_text
        else:
            summary = f"{sentences[0]}. {sentences[1]}. [Summary of {len(sentences)} sentences]"
            
        log_tool_to_backend("summarize_text", text[:200], summary, "success")
        return f"Summary: {summary}"

    @llm.ai_callable(description="Route a user text command to see how AstraMind schedules and interprets the action.")
    def command_router(self, user_text: str) -> str:
        logger.info(f"Requested manual command routing for: '{user_text}'")
        text = user_text.lower()
        
        routes = []
        if "open" in text or "launch" in text:
            routes.append("AppLauncher/BrowserTools (open app or website)")
        if "search" in text or "query" in text or "web" in text:
            routes.append("WebSearch (search the internet)")
        if "compare" in text or "versus" in text or "vs" in text:
            routes.append("CognitiveTools (item comparison)")
        if "file" in text or "write" in text or "folder" in text:
            routes.append("FileManager (create file/folder, read content)")
        if "info" in text or "ram" in text or "cpu" in text:
            routes.append("SystemInfo (gather machine metrics)")
        if "shutdown" in text or "restart" in text:
            routes.append("SystemControl (power options with safety confirmation)")
            
        if not routes:
            routes.append("General Chat (handled by LLM response pipeline)")
            
        result = f"Command '{user_text}' is mapped to: {', '.join(routes)}"
        log_tool_to_backend("command_router", user_text, result, "success")
        return result
