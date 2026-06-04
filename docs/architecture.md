# AstraMind System Architecture

This document describes the design, components, and data-flow topology of the **AstraMind LiveKit AI Agent** system.

## Overall Topology

AstraMind is a multi-service platform consisting of a React Next.js dashboard, a FastAPI control server, a local SQLite store, and a Python-based Voice Pipeline Agent running on the host system.

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
       │  │ - tool_logs           │  │       │             │
       │  │ - conversations       │  │   ┌───┴─────────────┴─────┐
       │  │ - settings            │  │   │                       │
       │  └───────────────────────┘  │   │   PYTHON VOICE AGENT  │
       │                             │   │                       │
       └─────────────────────────────┘   └───────────────────────┘
```

## System Components

### 1. Next.js Dashboard Cockpit
- **Role**: Serves as the operator interface.
- **Features**:
  - Voice room connection manager (via LiveKit React components).
  - Live, historical transcript panel mapping spoken interactions.
  - Diagnostic system resource graphs showing CPU load, RAM memory, storage limits, and host operating system.
  - Safety controller toggle panel to adjust permissions dynamically.

### 2. FastAPI Backend Core
- **Role**: Coordinates tokens, settings synchronization, and SQL storage.
- **Features**:
  - Access Token Generator: Yields JWT LiveKit permissions to secure WebRTC sessions.
  - Logging API: Records logs and command histories.
  - Diagnostic Telemetry Endpoint: Exposes live resource utilization statistics via `psutil`.
  - SQLite Store (SQLAlchemy): Tracks commands, settings, conversations, and logs.

### 3. Voice Pipeline Agent
- **Role**: Runs as a daemon to handle real-time WebRTC audio streams.
- **Features**:
  - Voice Pipeline: Implements Silero VAD (Voice Activity Detection), OpenAI STT (Whisper), Gemini 2.5 Flash LLM, and OpenAI TTS.
  - Tool Invoker: Integrates Windows automation scripts (App Launcher, Browser Tools, File Manager, System Telemetry, System Control, Cognitive Comparisons).
  - Safety Shield: Verifies safety permissions and matches user transcriptions with active power operations before executing Windows power triggers.
