import merge from "lodash/merge";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(10, 45%, 97%)",
          100: "hsl(10, 45%, 90%)",
          200: "hsl(10, 45%, 80%)",
          300: "hsl(10, 45%, 70%)",
          400: "hsl(10, 45%, 60%)",
          500: "hsl(10, 45%, 52%)",
          600: "hsl(10, 45%, 40%)",
          700: "hsl(10, 45%, 30%)",
          800: "hsl(10, 45%, 20%)",
          900: "hsl(10, 45%, 10%)",
        },
        brand1Grey: {
          50: "hsl(10, 15%, 97%)",
          100: "hsl(10, 15%, 90%)",
          200: "hsl(10, 15%, 80%)",
          300: "hsl(10, 15%, 70%)",
          400: "hsl(10, 15%, 60%)",
          500: "hsl(10, 15%, 52%)",
          600: "hsl(10, 15%, 40%)",
          700: "hsl(10, 15%, 30%)",
          800: "hsl(10, 15%, 20%)",
          900: "hsl(10, 15%, 10%)",
        },
        brand2: {
          50: "hsl(10, 45%, 97%)",
          100: "hsl(10, 45%, 90%)",
          200: "hsl(10, 45%, 80%)",
          300: "hsl(10, 45%, 70%)",
          400: "hsl(10, 45%, 60%)",
          500: "hsl(10, 45%, 52%)",
          600: "hsl(10, 45%, 40%)",
          700: "hsl(10, 45%, 30%)",
          800: "hsl(10, 45%, 20%)",
          900: "hsl(10, 45%, 10%)",
        },
      },
    },
  },
});
