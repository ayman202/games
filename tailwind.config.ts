import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        surface: "#12151c",
        accent: "var(--accent, #7c5cff)",
        accent2: "#00e5c7",
      },
    },
  },
  plugins: [],
};
export default config;
