const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface Command {
  id: number;
  user_text: string;
  agent_response?: string;
  tool_name?: string;
  status: string;
  timestamp: string;
}

export interface ToolLog {
  id: number;
  tool_name: string;
  input?: string;
  output?: string;
  status: string;
  error_message?: string;
  timestamp: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
}

export interface TokenResponse {
  token: string;
  livekit_url: string;
  room_name: string;
}

export async function fetchLiveKitToken(identity: string, roomName?: string): Promise<TokenResponse> {
  const res = await fetch(`${BACKEND_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity, room_name: roomName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to retrieve LiveKit token");
  }
  return res.json();
}

export async function fetchCommands(limit = 30): Promise<Command[]> {
  const res = await fetch(`${BACKEND_URL}/commands?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch commands history");
  return res.json();
}

export async function fetchToolLogs(limit = 30): Promise<ToolLog[]> {
  const res = await fetch(`${BACKEND_URL}/logs?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch tool logs");
  return res.json();
}

export async function fetchSettings(): Promise<Setting[]> {
  const res = await fetch(`${BACKEND_URL}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSetting(key: string, value: string): Promise<Setting> {
  const res = await fetch(`${BACKEND_URL}/settings/${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`Failed to update setting: ${key}`);
  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export interface SystemInfoData {
  os: string;
  cpu: number;
  ram: number;
  disk: number;
  battery: number | null;
  battery_charging: boolean | null;
}

export async function fetchSystemInfo(): Promise<SystemInfoData> {
  const res = await fetch(`${BACKEND_URL}/system-info`);
  if (!res.ok) throw new Error("Failed to fetch system info");
  return res.json();
}
