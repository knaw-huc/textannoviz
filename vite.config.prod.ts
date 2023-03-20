/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  build: {
    // Relative to the root
    outDir: "./dist",
  },

  esbuild: {
    drop: ["console"],
  },

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

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
