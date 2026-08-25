import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e7f2f1",
          100: "#cde4e1",
          500: "#167174",
          600: "#0f5c5e",
          700: "#083f42",
          900: "#062f31"
        },
        accent: {
          50: "#fdf6e6",
          100: "#f8e7b8",
          500: "#f4b942",
          600: "#d99a22"
        },
        ink: "#172326",
        muted: "#526568",
        surface: "#f8f7f3",
        line: "#d9e0dc"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
