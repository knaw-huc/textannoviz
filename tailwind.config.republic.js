import { nextui } from "@nextui-org/react";
import typography from "@tailwindcss/typography";
import reactAria from "tailwindcss-react-aria-components/src/index";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        public: ["Public Sans", "sans-serif"],
      },
      colors: {
        brand1: {
          50: "hsl(32, 95%, 96%)",
          100: "hsl(32, 65%, 90%)",
          200: "hsl(32, 95%, 80%)",
          300: "hsl(32, 95%, 70%)",
          400: "hsl(32, 95%, 64%)",
          500: "hsl(32, 95%, 50%)",
          600: "hsl(32, 95%, 40%)",
          700: "hsl(32, 95%, 30%)",
          800: "hsl(32, 95%, 20%)",
          900: "hsl(32, 95%, 10%)",
          950: "#2B2B2B",
        },
        brand1Grey: {
          50: "hsl(32, 15%, 97%)",
          100: "hsl(32, 15%, 90%)",
          200: "hsl(32, 15%, 80%)",
          300: "hsl(32, 15%, 70%)",
          400: "hsl(32, 15%, 60%)",
          500: "hsl(32, 15%, 52%)",
          600: "hsl(32, 15%, 40%)",
          700: "hsl(32, 15%, 30%)",
          800: "hsl(32, 15%, 20%)",
          900: "hsl(32, 15%, 10%)",
        },
        brand2: {
          50: "hsl(32, 95%, 96%)",
          100: "hsl(32, 65%, 90%)",
          200: "hsl(32, 95%, 80%)",
          300: "hsl(32, 95%, 70%)",
          400: "hsl(32, 95%, 64%)",
          500: "hsl(32, 95%, 50%)",
          600: "hsl(32, 95%, 40%)",
          700: "hsl(32, 95%, 30%)",
          800: "hsl(32, 95%, 20%)",
          900: "hsl(32, 95%, 10%)",
          950: "#2B2B2B",
        },
        entityColor: {
          location: "hsl(20, 67%, 97%)",
          person: "hsl(120, 67%, 90%)",
          institution: "hsl(160, 67%, 80%)",
        },
      },
      dropShadow: {
        top: "15px 15px 15px rgba(0, 0, 0, 0.75)",
      },
    },
  },
  darkMode: "class",
  plugins: [typography(), reactAria(), nextui()],
};
