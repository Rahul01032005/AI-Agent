"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, LayoutDashboard, Settings, Home, Activity } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 h-full w-64 border-r border-glass-border bg-cyber-bg/85 backdrop-blur-md px-4 py-6 text-cyber-text hidden md:flex flex-col">
      {/* Brand logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyber-primary to-cyber-purple flex items-center justify-center shadow-lg shadow-cyber-primary/20">
          <Cpu className="text-cyber-bg h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-bold text-white tracking-wider text-lg">AstraMind</span>
          <span className="text-[10px] block text-cyber-primary font-mono tracking-widest uppercase">LiveKit Agent</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-gradient-to-r from-cyber-primary/15 to-transparent text-cyber-primary border-l-2 border-cyber-primary"
                  : "hover:bg-glass-light text-cyber-text hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-cyber-primary" : "text-cyber-text group-hover:text-white"}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Connection Info */}
      <div className="p-4 rounded-2xl bg-glass-light border border-glass-border flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-green"></span>
        </div>
        <div className="text-xs">
          <span className="block text-white font-medium">AstraMind Agent</span>
          <span className="text-cyber-text/60 text-[10px]">API Version 1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
