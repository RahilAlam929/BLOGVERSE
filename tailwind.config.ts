import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
          soft: "#ede9fe"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(124, 58, 237, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;