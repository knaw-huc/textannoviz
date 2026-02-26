import _ from "lodash";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default _.merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(213, 100%, 97%)",
          100: "hsl(213, 100%, 90%)",
          200: "hsl(213, 100%, 80%)",
          300: "hsl(213, 100%, 70%)",
          400: "hsl(213, 100%, 60%)",
          500: "hsl(213, 100%, 52%)",
          600: "hsl(213, 100%, 40%)",
          700: "hsl(213, 100%, 30%)",
          800: "hsl(213, 100%, 14%)",
          900: "hsl(213, 100%, 10%)",
        },
        brand1Grey: {
          50: "hsl(0, 0%, 94%)",
          100: "hsl(0, 0%, 90%)",
          200: "hsl(0, 0%, 80%)",
          300: "hsl(0, 0%, 70%)",
          400: "hsl(0, 0%, 60%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 40%)",
          700: "hsl(0, 0%, 30%)",
          800: "hsl(0, 0%, 20%)",
          900: "hsl(0, 0%, 10%)",
        },
        brand2: {
          50: "hsl(0, 0%, 94%)",
          100: "hsl(0, 0%, 90%)",
          200: "hsl(0, 0%, 80%)",
          300: "hsl(0, 0%, 70%)",
          400: "hsl(0, 0%, 60%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 40%)",
          700: "hsl(0, 0%, 30%)",
          800: "hsl(0, 0%, 20%)",
          900: "hsl(0, 0%, 10%)",
        },
      },
    },
  },
});
