# AstraMind LiveKit AI Agent Project Plan

## Overview
AstraMind is an advanced real-time voice AI agent powered by LiveKit. It allows the user to speak naturally, control local Windows resources, open applications, search the web, compare technologies, manage local files, and check system status via a web dashboard.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, TypeScript, LiveKit React Components, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, SQLite database, SQLAlchemy.
- **Voice Agent**: LiveKit Agents Python SDK, Google Gemini API, OpenAI (optional fallback).

## File Structure
- `backend/`: REST endpoints and database models.
- `agent/`: LiveKit voice pipeline and automation tools.
- `frontend/`: Dashboard and landing pages.
- `docs/`: User manual and setup documentation.

## Phase Plan
1. **Infrastructure**: Initial setup (root files, .env.example, .gitignore).
2. **Backend**: FastAPI development with SQLAlchemy schemas, settings endpoint, token route.
3. **Agent**: VoicePipelineAgent orchestration, Windows safety confirmation system, app launching, web search, system telemetry.
4. **Frontend**: Landing page, full dashboard, voice connection, live transcript, settings toggles.
5. **Documentation**: Write architecture.md, setup.md, commands.md, and README.md.
