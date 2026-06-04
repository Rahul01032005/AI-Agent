"use client";

import React, { useEffect, useState } from "react";
import { Cpu, HardDrive, Database, BatteryCharging, ShieldAlert } from "lucide-react";
import { fetchSystemInfo, SystemInfoData } from "../lib/api";

export default function SystemStatus() {
  const [data, setData] = useState<SystemInfoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getMetrics = () => {
    fetchSystemInfo()
      .then((metrics) => {
        setData(metrics);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch system data");
        console.error(err);
      });
  };

  useEffect(() => {
    getMetrics();
    const interval = setInterval(getMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error || !data) {
    return (
      <div className="p-5 rounded-2xl bg-glass-light border border-glass-border backdrop-blur-md text-cyber-text flex flex-col items-center justify-center min-h-[160px]">
        <ShieldAlert className="text-cyber-red animate-pulse mb-2 h-8 w-8" />
        <span className="text-sm font-medium">Telemetry Offline</span>
        <span className="text-[10px] text-cyber-text/50">Run Python backend to start monitoring</span>
      </div>
    );
  }

  const items = [
    {
      title: "CPU Usage",
      value: `${data.cpu.toFixed(1)}%`,
      percent: data.cpu,
      icon: Cpu,
      color: "from-cyber-primary to-cyber-blue",
      shadow: "shadow-cyber-primary/10",
    },
    {
      title: "RAM Memory",
      value: `${data.ram.toFixed(1)}%`,
      percent: data.ram,
      icon: Database,
      color: "from-cyber-purple to-pink-500",
      shadow: "shadow-cyber-purple/10",
    },
    {
      title: "Disk Storage",
      value: `${data.disk.toFixed(1)}%`,
      percent: data.disk,
      icon: HardDrive,
      color: "from-cyber-blue to-cyan-400",
      shadow: "shadow-cyber-blue/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md flex flex-col justify-between shadow-lg ${item.shadow} hover:border-cyber-primary/30 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber-text/75">{item.title}</span>
              <div className="h-8 w-8 rounded-lg bg-glass-light flex items-center justify-center">
                <Icon className="h-4 w-4 text-cyber-primary" />
              </div>
            </div>
            
            <div className="mb-2">
              <span className="text-2xl font-bold text-white font-mono">{item.value}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-glass-light rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      {/* Battery status if available */}
      {data.battery !== null && (
        <div className="col-span-1 sm:col-span-3 p-4 rounded-xl bg-glass-light/50 border border-glass-border text-xs flex items-center justify-between text-cyber-text/75 font-mono">
          <div className="flex items-center gap-2">
            <BatteryCharging className="h-4 w-4 text-cyber-green" />
            <span>Power Level: {data.battery}% {data.battery_charging ? "(Charging)" : "(On Battery)"}</span>
          </div>
          <span className="hidden sm:inline text-cyber-text/50">Host OS: {data.os}</span>
        </div>
      )}
    </div>
  );
}
