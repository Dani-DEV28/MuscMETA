import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1e1e1e",
        "bg-secondary": "#2a2a2a",
        accent: "#ff6600",
        "accent-hover": "#e65c00",
        text: "#ffffff",
        "text-muted": "#dddddd",
        error: "#ff0000",
        success: "#028602",
        border: "#444444",
      },
    },
  },
  plugins: [],
};

export default config;
