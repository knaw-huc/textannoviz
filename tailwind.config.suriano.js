import _ from "lodash";
import defaultTailwindConfig from "./tailwind.config.default.js";

/** @type {import('tailwindcss').Config} */
export default _.merge(defaultTailwindConfig, {
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "hsl(40, 45%, 97%)",
          100: "hsl(40, 45%, 90%)",
          200: "hsl(40, 45%, 80%)",
          300: "hsl(40, 45%, 70%)",
          400: "hsl(40, 45%, 60%)",
          500: "hsl(40, 45%, 52%)",
          600: "hsl(40, 45%, 40%)",
          700: "hsl(40, 45%, 30%)",
          800: "hsl(40, 45%, 20%)",
          900: "hsl(40, 45%, 10%)",
        },
        brand1Grey: {
          50: "hsl(40, 15%, 97%)",
          100: "hsl(40, 15%, 90%)",
          200: "hsl(40, 15%, 80%)",
          300: "hsl(40, 15%, 70%)",
          400: "hsl(40, 15%, 60%)",
          500: "hsl(40, 15%, 52%)",
          600: "hsl(40, 15%, 40%)",
          700: "hsl(40, 15%, 30%)",
          800: "hsl(40, 15%, 20%)",
          900: "hsl(40, 15%, 10%)",
        },
        brand2: {
          50: "hsl(182, 84%, 96%)",
          100: "hsl(182, 84%, 90%)",
          200: "hsl(182, 84%, 80%)",
          300: "hsl(182, 84%, 70%)",
          400: "hsl(182, 84%, 60%)",
          500: "hsl(182, 84%, 50%)",
          600: "hsl(182, 84%, 40%)",
          700: "hsl(182, 84%, 30%)",
          800: "hsl(182, 84%, 20%)",
          900: "hsl(182, 84%, 15%)",
          950: "#2B2B2B",
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
