/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tailwindCss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let tailwindConfig: string;
  let title: string;

  switch (env.VITE_PROJECT) {
    case "republic":
      tailwindConfig = "tailwind.config.republic.js";
      title = "Textannoviz - Republic";
      break;
    case "mondriaan":
      tailwindConfig = "tailwind.config.mondriaan.js";
      title = "Textannoviz - Mondriaan";
      break;
    case "globalise":
      tailwindConfig = "tailwind.config.globalise.js";
      title = "Globalise Transcriptions Viewer";
      break;
    default:
      tailwindConfig = "tailwind.config.js";
      title = "Textannoviz";
  }

  return {
    esbuild: {
      drop: ["console"],
    },
    plugins: [
      createHtmlPlugin({
        inject: {
          data: {
            title: title,
          },
        },
      }),
      react(),
    ],

    css: {
      postcss: {
        plugins: [tailwindCss(tailwindConfig)],
      },
    },

    build: {
      target: "esnext",
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
