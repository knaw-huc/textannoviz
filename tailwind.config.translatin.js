import _ from "lodash";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default _.merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(100, 45%, 97%)",
          100: "hsl(100, 45%, 90%)",
          200: "hsl(100, 45%, 80%)",
          300: "hsl(100, 45%, 70%)",
          400: "hsl(100, 45%, 60%)",
          500: "hsl(100, 45%, 52%)",
          600: "hsl(100, 45%, 40%)",
          700: "hsl(100, 45%, 30%)",
          800: "hsl(100, 45%, 20%)",
          900: "hsl(100, 45%, 10%)",
        },
        brand1Grey: {
          50: "hsl(100, 15%, 97%)",
          100: "hsl(100, 15%, 90%)",
          200: "hsl(100, 15%, 80%)",
          300: "hsl(100, 15%, 70%)",
          400: "hsl(100, 15%, 60%)",
          500: "hsl(100, 15%, 52%)",
          600: "hsl(100, 15%, 40%)",
          700: "hsl(100, 15%, 30%)",
          800: "hsl(100, 15%, 20%)",
          900: "hsl(100, 15%, 10%)",
        },
        brand2: {
          50: "hsl(100, 45%, 97%)",
          100: "hsl(100, 45%, 90%)",
          200: "hsl(100, 45%, 80%)",
          300: "hsl(100, 45%, 70%)",
          400: "hsl(100, 45%, 60%)",
          500: "hsl(100, 45%, 52%)",
          600: "hsl(100, 45%, 40%)",
          700: "hsl(100, 45%, 30%)",
          800: "hsl(100, 45%, 20%)",
          900: "hsl(100, 45%, 10%)",
        },
      },
    },
  },
});
