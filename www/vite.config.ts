//

import VercelSsr from "@magne4000/vite-plugin-vercel-ssr";
import React from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import Ssr from "vite-plugin-ssr/plugin";
import Vercel from "vite-plugin-vercel";
import TsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

//

export default defineConfig(async ({ mode }) => {
  return {
    plugins: [
      // hattip({
      //   hattipEntry: "/server/ssr.ts",
      // }),
      TsconfigPaths({ root: path.dirname(url.fileURLToPath(import.meta.url)) }),
      Vercel(),
      VercelSsr(),
      Ssr({ prerender: true }),
      UnoCSS(),
      React(),
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
