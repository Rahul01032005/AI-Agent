"use client";

import React, { useState, useEffect } from "react";
import VoiceRoom from "../../components/VoiceRoom";
import TranscriptPanel from "../../components/TranscriptPanel";
import CommandHistory from "../../components/CommandHistory";
import ToolLogs from "../../components/ToolLogs";
import SystemStatus from "../../components/SystemStatus";
import { fetchCommands, fetchToolLogs, fetchSettings, Command, ToolLog } from "../../lib/api";
import { Mic, Activity, ShieldCheck, ShieldAlert, Wifi } from "lucide-react";

export default function DashboardPage() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [logs, setLogs] = useState<ToolLog[]>([]);
  const [safetyMode, setSafetyMode] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [agentSpeaking, setAgentSpeaking] = useState<boolean>(false);

  // Poll database history
  const reloadHistory = () => {
    fetchCommands(15)
      .then(setCommands)
      .catch(console.error);

    fetchToolLogs(15)
      .then(setLogs)
      .catch(console.error);
  };

  const loadSettings = () => {
    fetchSettings()
      .then((data) => {
        const safety = data.find((s) => s.key === "SAFETY_MODE");
        if (safety) {
          setSafetyMode(safety.value.toLowerCase() === "true");
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    reloadHistory();
    loadSettings();

    // Set up polling intervals
    const historyInterval = setInterval(reloadHistory, 3000);
    const settingsInterval = setInterval(loadSettings, 5000);

    return () => {
      clearInterval(historyInterval);
      clearInterval(settingsInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header telemetry and indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-glass-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Control Cockpit</h1>
          <p className="text-xs text-cyber-text/60">Voice interaction portal and background execution console.</p>
        </div>

        {/* Global status pill banner */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Audio Link Status */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
            isConnected
              ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
              : "bg-zinc-900 border-glass-border text-cyber-text/50"
          }`}>
            <Wifi className="h-3 w-3" />
            <span>LINK: {isConnected ? "CONNECTED" : "OFFLINE"}</span>
          </span>

          {/* Safety mode indicator */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
            safetyMode
              ? "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
              : "bg-cyber-red/10 border-cyber-red/30 text-cyber-red"
          }`}>
            {safetyMode ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
            <span>SAFETY: {safetyMode ? "SHIELD ACTIVE" : "UNRESTRICTED"}</span>
          </span>
        </div>
      </div>

      {/* System usage statistics row */}
      <SystemStatus />

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column Left (Voice Room & Command History) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          <VoiceRoom
            onConnectedChange={setIsConnected}
            onSpeakingChange={setAgentSpeaking}
            safetyMode={safetyMode}
          />
          <CommandHistory commands={commands} />
        </div>

        {/* Column Right (Real-time Transcripts & Executed Tool Logs) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          <TranscriptPanel
            commands={commands}
            isConnected={isConnected}
            agentSpeaking={agentSpeaking}
          />
          <ToolLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}
