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
        annotation: {
          per100: "#D9BC22",
          per500: "#D9BC22",
          loc100: "#21BCF5",
          loc500: "#21BCF5",
          com100: "#762929",
          com500: "#762929",
          hoe100: "#33AE75",
          hoe500: "#33AE75",
          org100: "#9D7FC6",
          org500: "#9D7FC6",
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
