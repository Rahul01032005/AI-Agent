"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, LayoutDashboard, Settings, Home } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-cyber-bg/85 backdrop-blur-md px-6 py-4 text-cyber-text flex items-center justify-between">
      {/* Brand logo */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyber-primary to-cyber-purple flex items-center justify-center shadow-lg shadow-cyber-primary/20">
          <Cpu className="text-cyber-bg h-4 w-4 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-bold text-white tracking-wider text-base">AstraMind</span>
          <span className="text-[9px] block text-cyber-primary font-mono tracking-widest uppercase">LiveKit Agent</span>
        </div>
      </div>

      {/* Nav Links - Aligned Horizontally with proper spacing */}
      <nav className="flex items-center gap-1.5 sm:gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-300 font-semibold text-xs sm:text-sm ${
                isActive
                  ? "bg-cyber-primary/10 text-cyber-primary border-b-2 border-cyber-primary"
                  : "hover:bg-glass-light text-cyber-text hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Connection Info */}
      <div className="p-2 rounded-xl bg-glass-light border border-glass-border flex items-center gap-2 text-[10px] sm:text-xs">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
        </div>
        <span className="hidden sm:inline text-white font-medium">AstraMind Agent</span>
        <span className="text-cyber-text/60">v1.0</span>
      </div>
    </header>
  );
}
