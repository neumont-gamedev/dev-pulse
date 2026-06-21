import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        pulse: "#2563eb",
        mint: "#14b8a6",
        coral: "#f97316"
      }
    }
  },
  plugins: []
};

export default config;
