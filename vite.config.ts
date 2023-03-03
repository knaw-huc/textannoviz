import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  build: {
    // Relative to the root
    outDir: "./dist",
  },

  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: "Textannoviz",
        },
      },
    }),
    react({
      include: "**/*.{jsx,tsx}",
    }),
  ],
});
