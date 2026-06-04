import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          med: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.12)",
        },
        cyber: {
          bg: "#0b0c10",
          card: "#1f2833",
          primary: "#66fcf1",
          secondary: "#45f3ff",
          text: "#c5c6c7",
          dark: "#121824",
          blue: "#00b4d8",
          purple: "#7209b7",
          green: "#06d6a0",
          red: "#ef476f",
        }
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow 2s infinite ease-in-out",
      },
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(102, 252, 241, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(102, 252, 241, 0.6)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
