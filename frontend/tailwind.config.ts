import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        smo: { DEFAULT: "#2563eb", 50: "#eff6ff", 100: "#dbeafe", 700: "#1d4ed8" },
        ric: { DEFAULT: "#16a34a", 50: "#f0fdf4", 100: "#dcfce7", 700: "#15803d" },
        xapp: { DEFAULT: "#9333ea", 50: "#faf5ff", 100: "#f3e8ff", 700: "#7e22ce" },
        rapp: { DEFAULT: "#ea580c", 50: "#fff7ed", 100: "#ffedd5", 700: "#c2410c" },
      },
    },
  },
  plugins: [],
};

export default config;
