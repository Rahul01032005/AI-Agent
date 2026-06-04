import psutil
import platform
import logging
from livekit.agents import llm
from agent.utils.logger import log_tool_to_backend

logger = logging.getLogger("astramind.tools.system_info")

class SystemInfo:
    @llm.ai_callable(description="Retrieve local computer diagnostic information such as OS version, CPU utilization, RAM usage, storage space, and battery level.")
    def system_info(self) -> str:
        logger.info("Requested system information telemetry.")
        try:
            # CPU
            cpu_usage = psutil.cpu_percent(interval=0.5)
            cpu_cores = psutil.cpu_count(logical=True)
            
            # RAM
            ram = psutil.virtual_memory()
            ram_used_gb = ram.used / (1024 ** 3)
            ram_total_gb = ram.total / (1024 ** 3)
            ram_percent = ram.percent
            
            # Disk
            disk = psutil.disk_usage('/')
            disk_used_gb = disk.used / (1024 ** 3)
            disk_total_gb = disk.total / (1024 ** 3)
            disk_percent = disk.percent
            
            # Battery
            battery = psutil.sensors_battery()
            battery_str = "Not available"
            if battery:
                plugged = "charging" if battery.power_plugged else "discharging"
                battery_str = f"{battery.percent}% ({plugged})"
                
            os_name = f"{platform.system()} {platform.release()}"
            
            summary = (
                f"System Telemetry Summary:\n"
                f"- OS: {os_name}\n"
                f"- CPU Load: {cpu_usage}% ({cpu_cores} logical cores)\n"
                f"- Memory: {ram_percent}% used ({ram_used_gb:.1f} GB of {ram_total_gb:.1f} GB)\n"
                f"- Disk Storage: {disk_percent}% used ({disk_used_gb:.1f} GB of {disk_total_gb:.1f} GB)\n"
                f"- Battery: {battery_str}"
            )
            
            log_tool_to_backend("system_info", "get", summary, "success")
            return summary
        except Exception as e:
            error_msg = f"Failed to gather system diagnostics: {str(e)}"
            log_tool_to_backend("system_info", "get", "", "failed", error_msg)
            return error_msg
