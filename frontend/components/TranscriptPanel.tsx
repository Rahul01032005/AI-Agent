"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquare, User, Bot } from "lucide-react";
import { Command } from "../lib/api";

interface TranscriptPanelProps {
  commands: Command[];
  isConnected: boolean;
  agentSpeaking: boolean;
}

export default function TranscriptPanel({ commands, isConnected, agentSpeaking }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when commands update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commands, agentSpeaking]);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md overflow-hidden">
      <div className="px-5 py-4 border-b border-glass-border bg-glass-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-cyber-primary h-4 w-4" />
          <span className="text-sm font-semibold text-white">Live Transcription</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isConnected && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
            </span>
          )}
          <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-text/50">
            {isConnected ? "Listening" : "Offline"}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent"
      >
        {commands.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cyber-text/40">
            <Bot className="h-10 w-10 mb-2 stroke-[1.5] animate-pulse" />
            <p className="text-xs">No active conversation transcript yet.</p>
            <p className="text-[10px] mt-1">Connect your microphone to start speaking with AstraMind.</p>
          </div>
        ) : (
          [...commands].reverse().map((cmd) => (
            <div key={cmd.id} className="space-y-3">
              {/* User Utterance */}
              <div className="flex items-start gap-3 justify-end">
                <div className="flex flex-col items-end max-w-[80%]">
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-none bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs leading-relaxed">
                    {cmd.user_text}
                  </div>
                  <span className="text-[9px] text-cyber-text/40 font-mono mt-1 flex items-center gap-1">
                    <User className="h-2.5 w-2.5" /> Rahul
                  </span>
                </div>
              </div>

              {/* Agent Reply */}
              {cmd.agent_response && (
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-cyber-primary" />
                  </div>
                  <div className="flex flex-col items-start max-w-[80%]">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-glass-med border border-glass-border text-white text-xs leading-relaxed">
                      {cmd.agent_response}
                    </div>
                    <span className="text-[9px] text-cyber-text/40 font-mono mt-1">
                      AstraMind
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Real-time speech indicator */}
        {agentSpeaking && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="h-7 w-7 rounded-lg bg-cyber-primary/20 border border-cyber-primary/40 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-cyber-primary" />
            </div>
            <div className="flex flex-col items-start">
              <div className="px-4 py-2 rounded-full bg-cyber-primary/5 border border-cyber-primary/20 text-cyber-primary/70 text-[10px] font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-ping"></span>
                AstraMind is speaking...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
