/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { htmlInjectionPlugin } from "vite-plugin-html-injection";
import globaliseHtmlInjectionPluginConfig from "./src/projects/globalise/config/htmlInjectionPluginConfig.json";
import republicHtmlInjectionPluginConfig from "./src/projects/republic/config/htmlInjectionPluginConfig.json";
import israelsHtmlInjectionPluginConfig from "./src/projects/israels/config/htmlInjectionPluginConfig.json";
import vangoghHtmlInjectionPluginConfig from "./src/projects/vangogh/config/htmlInjectionPluginConfig.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let htmlInjectionPluginConfig: any;

  switch (env.VITE_PROJECT) {
    case "republic":
      htmlInjectionPluginConfig = republicHtmlInjectionPluginConfig;
      break;
    case "globalise":
      htmlInjectionPluginConfig = globaliseHtmlInjectionPluginConfig;
      break;
    case "vangogh":
      htmlInjectionPluginConfig = vangoghHtmlInjectionPluginConfig;
      break;
    case "israels":
      htmlInjectionPluginConfig = israelsHtmlInjectionPluginConfig;
      break;
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
      postcss: { plugins: [] },
    },

    build: {
      target: "esnext",
      sourcemap: true,
    },
    base: env.VITE_ROUTER_BASENAME ?? "/",
  };
});
