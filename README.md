# AstraMind LiveKit AI Agent

AstraMind is an advanced real-time voice AI assistant (like a mini Jarvis) built using LiveKit, FastAPI, and Next.js. Speak naturally to AstraMind, and it will answer verbally while executing system automation tasks on your Windows laptop.

---

## Architecture Diagram

```
       ┌─────────────────────────────────────────────────────────┐
       │                                                         │
       │                   NEXT.JS DASHBOARD                     │
       │                                                         │
       └─────┬───────────────▲───────────────▲─────────────┬─────┘
             │               │               │             │
             │ REST API      │ REST API      │ WebSocket   │ Audio Link
             │ (POST/token)  │ (GET/logs)    │ (LiveKit)   │ (Microphone)
             ▼               │               │             ▼
       ┌─────────────────────┴───────┐   ┌───┴─────────────┴─────┐
       │                             │   │                       │
       │       FASTAPI BACKEND       │   │    LIVEKIT SERVER     │
       │                             │   │     (CLOUD/LOCAL)     │
       │  ┌───────────────────────┐  │   │                       │
       │  │    SQLite Database    │  │   └───▲─────────────▲─────┘
       │  │                       │  │       │             │
       │  │ - commands            │  │       │ WebSocket   │ Audio Link
       │  │ - tool_logs           │  │   ┌───┴─────────────┴─────┐
       │  │ - conversations       │  │   │                       │
       │  │ - settings            │  │   │   PYTHON VOICE AGENT  │
       │  │                       │  │   │                       │
       │  └───────────────────────┘  │   │ - STT: OpenAI         │
       │                             │   │ - LLM: Gemini 2.5     │
       └─────────────────────────────┘   │ - TTS: OpenAI         │
                                         └───────────────────────┘
```

---

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, `@livekit/components-react`, Framer Motion, Lucide React.
- **Backend**: FastAPI (Python), SQLite database, SQLAlchemy.
- **Voice Agent**: LiveKit Agents Python SDK, Google Gemini API, OpenAI (STT/TTS & LLM fallback), `psutil`, `pyautogui`.

---

## Folder Structure

```
astramind-livekit-agent/
│
├── frontend/                 # Next.js Cockpit App
│   ├── app/                  # App router pages (dashboard, settings)
│   ├── components/           # VoiceRoom, SystemStatus, TranscriptPanel, etc.
│   ├── lib/                  # api.ts Rest clients
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                  # FastAPI REST Server
│   ├── routes/               # token, commands, logs, settings routes
│   ├── services/             # LiveKit token generator, logger services
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
│
├── agent/                    # Python Voice Agent Worker
│   ├── tools/                # app_launcher, file_manager, web_search, system_control
│   ├── utils/                # logger.py, confirmation.py
│   ├── main.py               # VoicePipelineAgent runner
│   └── requirements.txt
│
├── docs/                     # Architecture, Setup, and Spoken Commands manuals
│   ├── architecture.md
│   ├── setup.md
│   └── commands.md
│
├── .gitignore
├── .env.example
├── project_plan.md
└── README.md
```

---

## LiveKit & API Keys Setup

### 1. LiveKit Cloud Credentials
1. Go to [LiveKit Cloud](https://cloud.livekit.io/) and sign up.
2. Create a new project.
3. Navigate to **Settings** -> **Keys** and click **Generate Key**.
4. Copy the **LiveKit Server URL**, **API Key**, and **API Secret**.

### 2. Gemini & OpenAI API Keys
- **Gemini**: Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
- **OpenAI**: Get a developer key from [OpenAI Platform](https://platform.openai.com/).

### 3. Root Env Setup
Create a `.env` file in the root directory:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
GOOGLE_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
AI_PROVIDER=gemini
```

---

## Installation & Running

### 1. Run Backend API
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 2. Run Voice Agent Worker
```cmd
cd agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py dev
```

### 3. Run Frontend Dashboard
```cmd
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to access the console.

---

## Spoken Commands List

- *"Open Chrome"*
- *"Open VS Code"*
- *"Tell me my system RAM and CPU usage"*
- *"Search best AI internships for MCA students"*
- *"Compare Gemini API and OpenAI API"*
- *"Create a file called College Projects"*
- *"Shutdown my laptop"* (Requires verbal confirmation *"confirm shutdown"*)

---

## Troubleshooting & Common Errors

### 1. `npx` or `node` not found:
Ensure Node.js is installed on your Windows machine and is added to the system environment PATH variables.
### 2. LiveKit authentication token errors:
Double check that `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are exactly matched on the backend `.env` variables.
### 3. Speech-To-Text / Text-To-Speech silent errors:
Ensure your microphone permission is granted in the web browser, and the `OPENAI_API_KEY` is configured in the `.env` (used for Whisper STT and TTS).

---

## Future Enhancements
1. Add localized offline STT/TTS (e.g. Kokoro, Coqui TTS, or Whisper local) to bypass OpenAI network calls.
2. Support advanced automation macros via `pyautogui` script recordings.
3. Integrate custom styling themes (Neon Cyberpunk, Light Glassmorphic).

---

## UI Screenshots
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/8bf787e1-7769-4afc-8947-df1fb43f337f" />
<img width="1919" height="943" alt="image" src="https://github.com/user-attachments/assets/4df75789-9a6c-441c-bf99-563e8d2892d9" />


