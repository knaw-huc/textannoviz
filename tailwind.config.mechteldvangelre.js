import _ from "lodash";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default _.merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(197, 72%, 97%)",
          100: "hsl(197, 72%, 90%)",
          200: "hsl(197, 72%, 80%)",
          300: "hsl(197, 72%, 70%)",
          400: "hsl(197, 72%, 60%)",
          500: "hsl(197, 72%, 52%)",
          600: "hsl(197, 72%, 40%)",
          700: "hsl(197, 72%, 30%)",
          800: "hsl(197, 72%, 20%)",
          900: "hsl(197, 72%, 10%)",
        },
        brand1Grey: {
          50: "hsl(209, 1%, 97%)",
          100: "hsl(209, 1%, 90%)",
          200: "hsl(209, 1%, 80%)",
          300: "hsl(209, 1%, 70%)",
          400: "hsl(209, 1%, 60%)",
          500: "hsl(209, 1%, 52%)",
          600: "hsl(209, 1%, 40%)",
          700: "hsl(209, 1%, 30%)",
          800: "hsl(209, 1%, 20%)",
          900: "hsl(209, 1%, 10%)",
        },
        brand2: {
          50: "hsl(197, 45%, 97%)",
          100: "hsl(197, 45%, 90%)",
          200: "hsl(197, 45%, 80%)",
          300: "hsl(197, 45%, 70%)",
          400: "hsl(197, 45%, 60%)",
          500: "hsl(197, 45%, 52%)",
          600: "hsl(197, 45%, 40%)",
          700: "hsl(197, 45%, 30%)",
          800: "hsl(197, 45%, 20%)",
          900: "hsl(197, 45%, 10%)",
        },
        entityColor: {
          location: "hsl(20, 67%, 97%)",
          person: "hsl(120, 67%, 90%)",
          institution: "hsl(160, 67%, 80%)",
        },
      },
    },
  },
});
