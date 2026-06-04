"use client";

import React, { useState, useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant } from "@livekit/components-react";
import { Mic, MicOff, Wifi, WifiOff, RefreshCw, Bot, ShieldAlert } from "lucide-react";
import { fetchLiveKitToken } from "../lib/api";

interface VoiceRoomProps {
  onConnectedChange: (connected: boolean) => void;
  onSpeakingChange: (speaking: boolean) => void;
  safetyMode: boolean;
}

export default function VoiceRoom({ onConnectedChange, onSpeakingChange, safetyMode }: VoiceRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const startSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const identity = `user_${Math.random().toString(36).substring(7)}`;
      // Call token generation backend
      const data = await fetchLiveKitToken(identity);
      
      setToken(data.token);
      setUrl(data.livekit_url || "wss://astramind-agent-xxxxxx.livekit.cloud"); // Fallback
      setRoomName(data.room_name);
      setIsConnected(true);
      onConnectedChange(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish LiveKit session. Ensure backend is running and env keys are configured.");
      onConnectedChange(false);
    } finally {
      setLoading(false);
    }
  };

  const endSession = () => {
    setToken(null);
    setUrl(null);
    setIsConnected(false);
    onConnectedChange(false);
    onSpeakingChange(false);
  };

  return (
    <div className="rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md p-6 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-glass-border">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">AstraMind Voice Link</h3>
          <p className="text-[10px] text-cyber-text/50 font-mono mt-0.5">
            {isConnected ? `Room: ${roomName}` : "Session Offline"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {safetyMode ? (
            <span className="flex items-center gap-1 text-[10px] font-mono text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded-full">
              <ShieldAlert className="h-3 w-3" /> Shield ON
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono text-cyber-red bg-cyber-red/10 border border-cyber-red/20 px-2 py-0.5 rounded-full">
              Shield OFF
            </span>
          )}
        </div>
      </div>

      {/* Main visualizer and controls */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        {token && url ? (
          <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={endSession}
            className="flex flex-col items-center justify-center w-full"
          >
            {/* Audio output handler */}
            <RoomAudioRenderer />
            
            {/* Custom controls inner wrapper */}
            <RoomControls 
              onSpeakingChange={onSpeakingChange} 
              onDisconnect={endSession} 
            />
          </LiveKitRoom>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Standby Pulse circle */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-cyber-primary/10 animate-pulse-slow scale-150"></div>
              <div className="h-20 w-20 rounded-full bg-glass-med border border-glass-border flex items-center justify-center relative">
                <Bot className="h-10 w-10 text-cyber-primary animate-pulse" />
              </div>
            </div>

            {error && (
              <p className="text-xs text-cyber-red mb-4 max-w-[250px] leading-relaxed font-mono">
                {error}
              </p>
            )}

            <button
              onClick={startSession}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-blue text-cyber-bg font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyber-primary/20 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Start Voice Agent
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Inner Controls utilizing LiveKit Context
interface RoomControlsProps {
  onSpeakingChange: (speaking: boolean) => void;
  onDisconnect: () => void;
}

function RoomControls({ onSpeakingChange, onDisconnect }: RoomControlsProps) {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  // Toggle Microphone state
  const toggleMute = async () => {
    if (localParticipant) {
      const isCurrentlyMuted = localParticipant.isMicrophoneEnabled === false;
      await localParticipant.setMicrophoneEnabled(isCurrentlyMuted);
      setIsMuted(isCurrentlyMuted);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Live Voice Pulse Circle */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 rounded-full bg-cyber-primary/20 animate-ping scale-125 ${isMuted ? "paused" : ""}`}></div>
        <div className={`h-24 w-24 rounded-full flex items-center justify-center border relative transition-all duration-500 ${
          isMuted 
            ? "bg-cyber-red/10 border-cyber-red/30 shadow-lg shadow-cyber-red/10" 
            : "bg-cyber-primary/10 border-cyber-primary/30 shadow-lg shadow-cyber-primary/20 animate-glow-pulse"
        }`}>
          <Bot className={`h-12 w-12 ${isMuted ? "text-cyber-red" : "text-cyber-primary"}`} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isMuted
              ? "bg-cyber-red/20 border-cyber-red/40 text-cyber-red hover:bg-cyber-red/35"
              : "bg-glass-med border-glass-border text-white hover:bg-glass-light"
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Disconnect button */}
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-cyber-red text-white text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-cyber-red/25 hover:bg-cyber-red/80 transition-all duration-300"
        >
          <WifiOff className="h-4 w-4" /> Disconnect
        </button>
      </div>
    </div>
  );
}
