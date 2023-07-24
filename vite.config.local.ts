/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tailwindCss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const tailwindConfig =
    env.VITE_PROJECT === "republic"
      ? "tailwind.config.republic.js"
      : "tailwind.config.mondriaan.js";

  return {
    plugins: [
      createHtmlPlugin({
        inject: {
          data: {
            title: "Textannoviz",
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

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
