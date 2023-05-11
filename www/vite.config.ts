//

import { serve } from "@hono/node-server";
import vercelSsr from "@magne4000/vite-plugin-vercel-ssr";
import react from "@vitejs/plugin-react";
import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AddressInfo } from "node:net";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";
import vercel from "vite-plugin-vercel";
import { configDefaults } from "vitest/config";

//

export default defineConfig(async ({ mode }) => {
  const proxy = await setupProxy(mode !== "production");

  return {
    plugins: [
      vercel(),
      vercelSsr(),
      ssr({ prerender: true }),
      react(),
      UnoCSS(),
    ],
    server: {
      proxy,
    },
    vercel: {
      additionalEndpoints: [
        {
          source: "./src/api/opportunities.ts",
          destination: "api/opportunities",
          edge: true,
          addRoute: true,
        },
      ],
    },

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

//

async function setupProxy(enable: boolean) {
  if (!enable) return {} as const;
  const hono = new Hono();
  // const handlers = [await import("./src/api/opportunities")].map(
  //   ({ default: handler }) => handler
  // );ù
  const { routes } = await import("./src/api/opportunities");
  hono.use("*", logger());
  hono.route("/api", routes);
  const server: AddressInfo = await new Promise((resolve) => {
    serve(
      {
        fetch: hono.fetch,
        port: 0,
      },
      resolve
    );
  });
  // apiProxy.address();
  console.log({ server });
  // hono.use("*", ...handlers);
  // const apiProxy = http
  //   .createServer(async function (req, res) {
  //     const { url } = req;
  //     // const { default: sdf } = ;

  //     console.log("=> ", { url });
  //     // const reqq = new Request(req);
  //     res.end();
  //     // hono.fetch(req, process.env);
  //   })
  //   .listen(0);

  console.log("Setup Proxy");
  console.log("  /api  ➜  http://localhost:" + server.port);

  return {
    "/api": `http://localhost:${server.port}`, //(apiProxy.address() as AddressInfo).port,
  } as const;
}
