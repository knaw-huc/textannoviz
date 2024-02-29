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
          50: "hsl(48, 45%, 97%)",
          100: "hsl(48, 45%, 90%)",
          200: "hsl(48, 45%, 80%)",
          300: "hsl(48, 45%, 70%)",
          400: "hsl(48, 45%, 60%)",
          500: "hsl(48, 45%, 52%)",
          600: "hsl(48, 45%, 40%)",
          700: "hsl(48, 45%, 30%)",
          800: "hsl(48, 45%, 20%)",
          900: "hsl(48, 45%, 10%)",
        },
        brand1Grey: {
          50: "hsl(48, 15%, 97%)",
          100: "hsl(48, 15%, 90%)",
          200: "hsl(48, 15%, 80%)",
          300: "hsl(48, 15%, 70%)",
          400: "hsl(48, 15%, 60%)",
          500: "hsl(48, 15%, 52%)",
          600: "hsl(48, 15%, 40%)",
          700: "hsl(48, 15%, 30%)",
          800: "hsl(48, 15%, 20%)",
          900: "hsl(48, 15%, 10%)",
        },
        brand2: {
          50: "hsl(195, 30%, 97%)",
          100: "hsl(195, 30%, 90%)",
          200: "hsl(195, 30%, 80%)",
          300: "hsl(195, 30%, 70%)",
          400: "hsl(195, 30%, 60%)",
          500: "hsl(195, 30%, 52%)",
          600: "hsl(195, 30%, 40%)",
          700: "hsl(195, 30%, 30%)",
          800: "hsl(195, 30%, 20%)",
          900: "hsl(195, 30%, 10%)",
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
