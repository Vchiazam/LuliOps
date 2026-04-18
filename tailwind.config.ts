import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))", // ✅ THIS is the missing piece
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        background: "#1a0026",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#5e1d7b",
          foreground: "#ffffff",
        },
        card: "#241136",
        border: "#5e1d7b",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
