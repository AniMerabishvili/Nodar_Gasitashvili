import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF8F5",
          dark: "#F3EFE8",
        },
        ink: {
          DEFAULT: "#1C1C1C",
          muted: "#5A5550",
          light: "#8A847C",
        },
        accent: {
          DEFAULT: "#7A3B3B",
          soft: "#A05C5C",
          pale: "#EDE4E0",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-georgian)",
          "Noto Sans Georgian",
          "BPG Nino Mtavruli",
          "sylfaen",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-noto-serif-georgian)",
          "Noto Serif Georgian",
          "sylfaen",
          "Georgia",
          "serif",
        ],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
