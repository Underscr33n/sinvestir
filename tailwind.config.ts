import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // S'investir dark design system
        sinvestir: {
          bg:        "#07091a",
          "bg-card": "#0d1130",
          "bg-elevated": "#111638",
          border:    "#1e2548",
          "border-light": "#2a3260",
          primary:   "#3b6ef8",
          "primary-hover": "#2d5de8",
          "primary-muted": "#1e3a8a",
          accent:    "#f0b429",
          "accent-hover": "#d9a020",
          text:      "#ffffff",
          "text-secondary": "#8892b0",
          "text-muted": "#4a5480",
          success:   "#22c55e",
          danger:    "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "sinvestir-gradient": "radial-gradient(ellipse at 50% 0%, #1a2060 0%, #07091a 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
