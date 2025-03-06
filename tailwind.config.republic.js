import merge from "lodash/merge";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default merge(defaultTailwindConfig, {
  theme: {
    extend: {
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
      },
    },
  },
});
