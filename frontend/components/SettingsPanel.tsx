"use client";

import React, { useEffect, useState } from "react";
import { Settings, Shield, HardDrive, Wifi, Cpu, Sparkles, Check, AlertCircle } from "lucide-react";
import { fetchSettings, updateSetting, Setting } from "../lib/api";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getSettingsData = () => {
    setLoading(true);
    fetchSettings()
      .then((data) => {
        setSettings(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch settings from backend.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSettingsData();
  }, []);

  const handleToggle = async (key: string, currentValue: string) => {
    const newValue = currentValue.toLowerCase() === "true" ? "false" : "true";
    await saveSetting(key, newValue);
  };

  const handleSelect = async (key: string, newValue: string) => {
    await saveSetting(key, newValue);
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      );
      await updateSetting(key, value);
      setSuccessMsg(`Setting '${key}' saved successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(`Failed to save setting '${key}'`);
      getSettingsData(); // revert
    }
  };

  const getIcon = (key: string) => {
    switch (key) {
      case "SAFETY_MODE":
        return <Shield className="h-5 w-5 text-cyber-blue" />;
      case "ALLOW_SYSTEM_CONTROL":
        return <Cpu className="h-5 w-5 text-cyber-red" />;
      case "ALLOW_FILE_WRITE":
        return <HardDrive className="h-5 w-5 text-cyber-purple" />;
      case "ALLOW_WEB_SEARCH":
        return <Wifi className="h-5 w-5 text-cyber-green" />;
      default:
        return <Sparkles className="h-5 w-5 text-cyber-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md text-center text-cyber-text text-sm">
        <Sparkles className="animate-spin text-cyber-primary h-6 w-6 mx-auto mb-2" />
        Loading AstraMind configuration...
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-cyber-dark/45 border border-glass-border backdrop-blur-md p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
        <Settings className="text-cyber-primary h-6 w-6" />
        <div>
          <h2 className="text-lg font-bold text-white">System Controls & Preferences</h2>
          <p className="text-xs text-cyber-text/60">Configure AstraMind voice permissions, LLM model choice, and desktop safety parameters.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {settings.map((setting) => {
          const isBoolean = setting.value === "true" || setting.value === "false";
          const valBool = setting.value === "true";
          
          return (
            <div
              key={setting.id}
              className="p-4 rounded-xl bg-glass-light border border-glass-border hover:bg-glass-med hover:border-glass-border/30 transition-all duration-300 flex items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 h-9 w-9 rounded-lg bg-glass-light border border-glass-border flex items-center justify-center">
                  {getIcon(setting.key)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">{setting.key}</h3>
                  <p className="text-xs text-cyber-text/75 mt-0.5 leading-relaxed">{setting.description}</p>
                </div>
              </div>

              <div className="shrink-0">
                {isBoolean ? (
                  <button
                    onClick={() => handleToggle(setting.key, setting.value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 outline-none ${
                      valBool ? "bg-cyber-primary shadow-lg shadow-cyber-primary/20" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-cyber-bg transition-transform duration-300 ${
                        valBool ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : setting.key === "AI_PROVIDER" ? (
                  <select
                    value={setting.value}
                    onChange={(e) => handleSelect(setting.key, e.target.value)}
                    className="bg-zinc-900 border border-glass-border text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyber-primary font-mono cursor-pointer"
                  >
                    <option value="gemini">Gemini API</option>
                    <option value="openai">OpenAI Fallback</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleSelect(setting.key, e.target.value)}
                    className="bg-zinc-900 border border-glass-border text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
