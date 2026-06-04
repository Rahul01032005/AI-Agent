"use client";

import React from "react";
import { History, CheckCircle, XCircle, AlertCircle, Wrench } from "lucide-react";
import { Command } from "../lib/api";

interface CommandHistoryProps {
  commands: Command[];
}

export default function CommandHistory({ commands }: CommandHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-cyber-green" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-cyber-red" />;
      case "pending_confirmation":
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-cyber-blue" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return "00:00";
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md overflow-hidden">
      <div className="px-5 py-4 border-b border-glass-border bg-glass-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="text-cyber-primary h-4 w-4" />
          <span className="text-sm font-semibold text-white">Recent Spoken Commands</span>
        </div>
        <span className="text-[10px] font-mono bg-cyber-primary/10 text-cyber-primary px-2 py-0.5 rounded-full">
          {commands.length} Logged
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[300px] space-y-3 scrollbar-thin scrollbar-thumb-glass-border">
        {commands.length === 0 ? (
          <div className="py-12 text-center text-cyber-text/30 text-xs">
            No command history found. Speak to log commands.
          </div>
        ) : (
          commands.map((cmd) => (
            <div
              key={cmd.id}
              className="p-3.5 rounded-xl bg-glass-light border border-glass-border hover:bg-glass-med transition-all duration-200 text-xs"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-white leading-tight">
                  "{cmd.user_text}"
                </p>
                <div className="shrink-0 flex items-center gap-1.5 font-mono text-[10px]">
                  <span>{formatTime(cmd.timestamp)}</span>
                  {getStatusIcon(cmd.status)}
                </div>
              </div>

              {cmd.agent_response && (
                <p className="text-cyber-text/80 mb-2 leading-relaxed pl-2 border-l border-glass-border">
                  {cmd.agent_response}
                </p>
              )}

              {cmd.tool_name && (
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyber-primary bg-cyber-primary/5 border border-cyber-primary/10 px-2 py-1 rounded w-fit mt-1">
                  <Wrench className="h-3 w-3" />
                  <span>Executed: {cmd.tool_name}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
