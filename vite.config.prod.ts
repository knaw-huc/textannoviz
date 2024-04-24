/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tailwindCss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let tailwindConfig: string;

  switch (env.VITE_PROJECT) {
    case "republic":
      tailwindConfig = "tailwind.config.republic.js";
      break;
    case "mondriaan":
      tailwindConfig = "tailwind.config.mondriaan.js";
      break;
    case "globalise":
      tailwindConfig = "tailwind.config.globalise.js";
      break;
    case "translatin":
      tailwindConfig = "tailwind.config.translatin.js";
      break;
    case "suriano":
      tailwindConfig = "tailwind.config.suriano.js";
      break;
    case "hooft":
      tailwindConfig = "tailwind.config.hooft.js";
      break;
    case "vangogh":
      tailwindConfig = "tailwind.config.vangogh.js";
      break;
    default:
      tailwindConfig = "tailwind.config.js";
  }

  return {
    esbuild: {
      drop: ["console"],
    },
    plugins: [react(), checker({ typescript: true })],

    css: {
      postcss: {
        plugins: [tailwindCss(tailwindConfig)],
      },
    },

    build: {
      target: "esnext",
    },
  };
});
