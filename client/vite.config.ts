/**
 * vite.config.ts - settings for the dev server and the build tool.
 *
 * The important part is `proxy`: the browser only ever talks to this dev
 * server (port 5173). Any URL starting with /api is forwarded to our Express
 * server (port 4000). If you change PORT in server/.env, change it here too.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  test: {
    environment: "node",
  },
});
