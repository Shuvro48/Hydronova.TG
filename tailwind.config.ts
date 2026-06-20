import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "#020d1a",
        ocean2: "#03152e",
        ocean3: "#0a2540",
        river: "#0ea5e9",
        river2: "#38bdf8",
        river3: "#7dd3fc",
        safe: "#22c55e",
        moderate: "#f59e0b",
        high: "#ef4444",
        severe: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Bengali", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
