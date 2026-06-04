# Setup Guide - AstraMind LiveKit AI Agent

Follow these instructions to configure and run the backend, agent, and frontend servers on Windows.

## Prerequisites
1. **Python 3.10+**: Ensure Python is installed and in your environment PATH.
2. **Node.js 18+**: (Optional for compiling frontend locally) or run build outputs.
3. **LiveKit Cloud Credentials**: Sign up for a free developer account at [LiveKit Cloud](https://cloud.livekit.io/) to get your Server URL, API Key, and Secret.
4. **Google Gemini API Key**: Obtain a key from Google AI Studio.
5. **OpenAI API Key**: (Optional) required if using Whisper STT or fallback TTS.

---

## 1. Environment Variable Configuration

Create a file named `.env` in the root project folder:

```env
# LiveKit Cloud credentials
LIVEKIT_URL=wss://your-project-url.livekit.cloud
LIVEKIT_API_KEY=devkey-xxxxxxx
LIVEKIT_API_SECRET=secret-xxxxxxx

# AI API Keys
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxx
GEMINI_MODEL=gemini-2.5-flash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxx
AI_PROVIDER=gemini

# App Ports
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Safety Preferences
SAFETY_MODE=true
ALLOW_SYSTEM_CONTROL=true
ALLOW_FILE_WRITE=true
ALLOW_WEB_SEARCH=true

# Room Settings
ROOM_NAME=astramind-room
AGENT_NAME=AstraMind
```

---

## 2. Backend Server Setup (FastAPI)

1. Open a command prompt and navigate to the backend folder:
   ```cmd
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Launch the backend:
   ```cmd
   uvicorn main:app --reload --port 8000
   ```
   *The SQLite database `astramind.db` will be initialized in this folder, and default settings will be seeded.*

---

## 3. Voice Agent Setup (Python)

1. Open a new command prompt and navigate to the agent folder:
   ```cmd
   cd agent
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Start the LiveKit Agent worker in dev mode:
   ```cmd
   python main.py dev
   ```

---

## 4. Frontend Cockpit Setup (Next.js)

1. Open a new command prompt and navigate to the frontend folder:
   ```cmd
   cd frontend
   npm install
   ```
2. Start the hot-reloading development server:
   ```cmd
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.
