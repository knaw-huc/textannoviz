import defaultTailwindConfig from "./tailwind.config.default.js";
import _ from "lodash";

/** @type {import('tailwindcss').Config} */
export default _.merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(350, 45%, 97%)",
          100: "hsl(350, 45%, 90%)",
          200: "hsl(350, 45%, 80%)",
          300: "hsl(350, 45%, 70%)",
          400: "hsl(350, 45%, 60%)",
          500: "hsl(350, 45%, 52%)",
          600: "hsl(350, 45%, 40%)",
          700: "hsl(350, 45%, 30%)",
          800: "hsl(350, 45%, 20%)",
          900: "hsl(350, 45%, 10%)",
        },
        brand1Grey: {
          50: "hsl(350, 15%, 97%)",
          100: "hsl(350, 15%, 90%)",
          200: "hsl(350, 15%, 80%)",
          300: "hsl(350, 15%, 70%)",
          400: "hsl(350, 15%, 60%)",
          500: "hsl(350, 15%, 52%)",
          600: "hsl(350, 15%, 40%)",
          700: "hsl(350, 15%, 30%)",
          800: "hsl(350, 15%, 20%)",
          900: "hsl(350, 15%, 10%)",
        },
        brand2: {
          50: "hsl(350, 45%, 97%)",
          100: "hsl(350, 45%, 90%)",
          200: "hsl(350, 45%, 80%)",
          300: "hsl(350, 45%, 70%)",
          400: "hsl(350, 45%, 60%)",
          500: "hsl(350, 45%, 52%)",
          600: "hsl(350, 45%, 40%)",
          700: "hsl(350, 45%, 30%)",
          800: "hsl(350, 45%, 20%)",
          900: "hsl(350, 45%, 10%)",
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
