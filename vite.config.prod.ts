/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    esbuild: {
      drop: ["console"],
    },
    plugins: [react(), checker({ typescript: true })],

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
