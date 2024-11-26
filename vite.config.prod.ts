/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tailwindCss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { htmlInjectionPlugin } from "vite-plugin-html-injection";
import globaliseHtmlInjectionPluginConfig from "./src/projects/globalise/config/htmlInjectionPluginConfig.json";
import republicHtmlInjectionPluginConfig from "./src/projects/republic/config/htmlInjectionPluginConfig.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let tailwindConfig: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let htmlInjectionPluginConfig: any;

  switch (env.VITE_PROJECT) {
    case "republic":
      tailwindConfig = "tailwind.config.republic.js";
      htmlInjectionPluginConfig = republicHtmlInjectionPluginConfig;
      break;
    case "mondriaan":
      tailwindConfig = "tailwind.config.mondriaan.js";
      break;
    case "globalise":
      tailwindConfig = "tailwind.config.globalise.js";
      htmlInjectionPluginConfig = globaliseHtmlInjectionPluginConfig;
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
      tailwindConfig = "tailwind.default.config.js";
  }

  return {
    esbuild: {
      drop: ["console"],
    },
    plugins: [
      react(),
      checker({ typescript: true }),
      htmlInjectionPluginConfig &&
        htmlInjectionPlugin(htmlInjectionPluginConfig),
    ],

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
