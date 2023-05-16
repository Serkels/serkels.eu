//

import vercelSsr from "@magne4000/vite-plugin-vercel-ssr";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";
import vercel from "vite-plugin-vercel";
import { configDefaults } from "vitest/config";

//

export default defineConfig(async ({ mode }) => {
  return {
    plugins: [
      vercel(),
      vercelSsr(),
      ssr({ prerender: true }),
      react(),
      UnoCSS(),
    ],
    maxThreads: mode === "e2e" ? 1 : undefined,
    minThreads: mode === "e2e" ? 1 : undefined,

    test: {
      env: { NODE_ENV: "dev" },
      exclude: configDefaults.exclude.concat(
        mode === "e2e" ? [] : ["**/*.e2e*"]
      ),
      hookTimeout: 1_000 * 60 * 60,
      include: ["**/*.{e2e,test,spec}.{ts,tsx}"],
      reporters: "verbose",
      teardownTimeout: 1_000 * 60 * 60,
      testTimeout: 1_000 * 60 * 60,
      watchExclude: configDefaults.watchExclude.concat(
        mode === "e2e" ? [] : ["**/*.e2e*"]
      ),
    },
  };
});
