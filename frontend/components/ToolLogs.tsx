"use client";

import React from "react";
import { Terminal, Check, X, AlertCircle } from "lucide-react";
import { ToolLog } from "../lib/api";

interface ToolLogsProps {
  logs: ToolLog[];
}

export default function ToolLogs({ logs }: ToolLogsProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <span className="flex items-center gap-0.5 text-cyber-green bg-cyber-green/10 border border-cyber-green/20 px-1.5 py-0.5 rounded font-mono text-[8px]">
            <Check className="h-2.5 w-2.5" /> OK
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-0.5 text-cyber-red bg-cyber-red/10 border border-cyber-red/20 px-1.5 py-0.5 rounded font-mono text-[8px]">
            <X className="h-2.5 w-2.5" /> ERR
          </span>
        );
      case "pending_confirmation":
        return (
          <span className="flex items-center gap-0.5 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono text-[8px] animate-pulse">
            <AlertCircle className="h-2.5 w-2.5" /> CONFIRM
          </span>
        );
      default:
        return (
          <span className="text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-1.5 py-0.5 rounded font-mono text-[8px]">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md overflow-hidden font-mono">
      <div className="px-5 py-4 border-b border-glass-border bg-glass-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="text-cyber-primary h-4 w-4" />
          <span className="text-sm font-semibold text-white">System Tool Output Logs</span>
        </div>
        <span className="text-[9px] text-cyber-text/50">Developer Console</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[300px] space-y-2.5 bg-black/20 text-xs">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-cyber-text/30 text-[11px]">
            $ No tool events recorded. Trigger agent capabilities to populate.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-glass-border bg-black/40 hover:border-cyber-primary/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-cyber-primary font-bold text-[11px]">
                  $ {log.tool_name}()
                </span>
                {getStatusBadge(log.status)}
              </div>

              {log.input && (
                <div className="mb-1 text-[10px] text-cyber-text/60">
                  <span className="text-cyber-purple font-medium">IN:</span> {log.input}
                </div>
              )}

              {log.output && (
                <div className="text-[10px] text-cyber-text/95 whitespace-pre-wrap pl-2 border-l border-glass-border">
                  <span className="text-cyber-green font-medium">OUT:</span> {log.output}
                </div>
              )}

              {log.error_message && (
                <div className="text-[10px] text-cyber-red bg-cyber-red/5 p-1.5 rounded border border-cyber-red/20 mt-1">
                  <span className="font-bold">ERROR:</span> {log.error_message}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
