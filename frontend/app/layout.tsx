import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstraMind LiveKit AI Agent Dashboard",
  description: "Real-time Voice AI agent for Windows laptop automation powered by LiveKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Modern font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cyber-bg min-h-screen text-cyber-text antialiased">
        <div className="flex min-h-screen relative overflow-hidden">
          {/* Animated blurred circles in the background for high-end aesthetics */}
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyber-primary/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyber-purple/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>

          {/* Navigation sidebar */}
          <Navbar />

          {/* Main dashboard content viewport */}
          <main className="flex-1 min-h-screen pt-20 w-full relative z-10">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
