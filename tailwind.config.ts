import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0A0A0B",
          900: "#111113",
          800: "#1A1A1E",
          700: "#252529",
          600: "#313138",
          500: "#4A4A55",
          400: "#6B6B7A",
          300: "#9B9BAA",
          200: "#C8C8D5",
          100: "#EAEAF0",
          50: "#F5F5FA",
        },
        accent: {
          DEFAULT: "#E85D26",
          light: "#FF7A45",
          dark: "#C44A18",
          muted: "#3D2218",
        },
        emerald: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          muted: "#0D2E22",
        },
        sapphire: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
          muted: "#0F2040",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "count-up": "countUp 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
