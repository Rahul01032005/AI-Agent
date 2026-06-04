# Spoken Commands Manual

AstraMind maps your spoken commands to local Python system automation scripts using LLM tool calling. Here is the operational catalog:

## Standard Commands

| User Voice Query | Triggered Python Tool | Action Performed |
|---|---|---|
| *"Hello AstraMind"* | (Chat) | Replies with a concise greeting addressing the user as Rahul. |
| *"Open Chrome"* | `open_app(app_name="chrome")` | Launches Google Chrome in a separate shell on Windows. |
| *"Open VS Code"* | `open_app(app_name="vscode")` | Launches Visual Studio Code. |
| *"Open YouTube"* | `open_website(url_or_name="youtube")` | Opens YouTube in the system's default browser. |
| *"Tell me my system RAM and CPU usage"* | `system_info()` | Gathers metrics via `psutil` and lists OS version, CPU load, RAM used/total, disk status, and battery. |
| *"Search best AI internships for MCA students"* | `web_search(query="...")` | Scrapes DuckDuckGo search summaries and outputs the top options. |
| *"Compare Gemini API and OpenAI API"* | `compare_items(item1="gemini", item2="openai")` | Renders a table comparing features, costs, and token limits. |
| *"Create a folder called College Projects"* | `create_folder(folder_name="College Projects")` | Initializes a directory under the workspace folder. |
| *"Create a file and write my project idea"* | `create_file(filename="idea.txt", content="...")` | Writes a new file inside the workspace folder. |
| *"Summarize this text: [long passage]"* | `summarize_text(text="...")` | Compiles a concise summary of the spoken passage. |

---

## Safety Confirmation Flow (Dangerous Commands)

To prevent destructive or system-critical operations, dangerous actions trigger a safety loop.

### Supported Dangerous Operations:
- `shutdown_system()` (Windows system shutdown)
- `restart_system()` (Windows system restart)
- `create_file()` (When overwriting an existing file)

### Visual Flow Example:

```
[User]: "Shutdown my laptop"
   │
   ▼
[AstraMind]: "This action needs confirmation. Please say: confirm shutdown."
   │
   ▼ (AstraMind sets pending state to 'shutdown')
[User]: "Confirm shutdown"
   │
   ▼ (AstraMind checks confirmation state; it matches 'shutdown')
[AstraMind]: "Shutdown command scheduled for 60 seconds from now..."
   │
   ▼ (Runs 'shutdown /s /t 60')
```

> [!NOTE]
> For safety, the shutdown and restart commands schedule a 60-second delay. You can abort the scheduled power action at any time by opening the command prompt (`cmd`) and typing `shutdown /a`.
