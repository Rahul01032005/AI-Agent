"use client";

import React from "react";
import Link from "next/link";
import { Mic, Terminal, Shield, Sparkles, Cpu, Globe, FolderPlus } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Real-Time Spoken Interaction",
      desc: "Connect instantly via LiveKit audio rooms. Speak commands naturally and receive low-latency verbal replies.",
      icon: Mic,
      color: "text-cyber-primary",
      bg: "bg-cyber-primary/10"
    },
    {
      title: "Windows App Control",
      desc: "Instruct the assistant to launch local software such as VS Code, Notepad, Edge, cmd, or Chrome.",
      icon: Terminal,
      color: "text-cyber-purple",
      bg: "bg-cyber-purple/10"
    },
    {
      title: "Workspace File Manager",
      desc: "Safely create text files, read file summaries, and initialize folders inside a secured workspace directory.",
      icon: FolderPlus,
      color: "text-cyber-blue",
      bg: "bg-cyber-blue/10"
    },
    {
      title: "Real-Time Web Search",
      desc: "Perform quick searches, query abstracts, and compare models/languages with formatted comparison reports.",
      icon: Globe,
      color: "text-cyber-green",
      bg: "bg-cyber-green/10"
    },
    {
      title: "Diagnostic Telemetry",
      desc: "Monitor system health including real-time CPU percentages, RAM memory limits, storage, and battery.",
      icon: Cpu,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10"
    },
    {
      title: "Fail-Safe Safety Shield",
      desc: "Critical operating system control requires verbal verification, preventing accidental shutdowns or overwrites.",
      icon: Shield,
      color: "text-cyber-red",
      bg: "bg-cyber-red/10"
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 relative">
      {/* Hero Title */}
      <div className="text-center max-w-3xl mb-16 relative">
        {/* Glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-72 rounded-full bg-cyber-primary/10 blur-[80px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glass-light border border-glass-border mb-6 text-xs text-cyber-primary font-mono tracking-wider">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>PRODUCTION-GRADE VOICE ASSISTANT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
          Meet <span className="bg-gradient-to-r from-cyber-primary via-cyber-blue to-cyber-purple bg-clip-text text-transparent">AstraMind</span>
        </h1>

        <p className="text-lg sm:text-xl text-cyber-text/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          A Real-Time LiveKit Voice AI Agent for Desktop Automation. Run tasks, manage workspaces, query telemetry, and control your laptop using natural speech.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyber-primary to-cyber-blue text-cyber-bg font-extrabold tracking-wider uppercase shadow-lg shadow-cyber-primary/25 hover:scale-105 hover:shadow-cyber-primary/30 transition-all duration-300 text-center"
          >
            Launch Cockpit
          </Link>
          <Link
            href="/settings"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-glass-med border border-glass-border hover:bg-glass-light hover:border-glass-border/30 text-white font-bold tracking-wider uppercase transition-all duration-300 text-center"
          >
            Preferences
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-cyber-dark/40 border border-glass-border hover:border-cyber-primary/30 hover:bg-cyber-dark/60 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
            >
              <div className={`h-11 w-11 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-5.5 w-5.5 ${feat.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-sans tracking-wide">
                {feat.title}
              </h3>
              <p className="text-xs text-cyber-text/75 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
