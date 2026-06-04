"use client";

import React from "react";
import SettingsPanel from "../../components/SettingsPanel";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="border-b border-glass-border pb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-cyber-primary h-6 w-6" />
          <h1 className="text-2xl font-black text-white tracking-tight">System Preferences</h1>
        </div>
        <p className="text-xs text-cyber-text/60">Configure agent security tokens, provider credentials, and system actions.</p>
      </div>

      <div className="flex-1 py-4">
        <SettingsPanel />
      </div>
    </div>
  );
}
