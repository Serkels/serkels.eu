//

import "./dotenv";

//

import { prisma } from "@1.infra/database";
import { Email_Sender } from "@1.infra/email";
import { router } from "@1.infra/trpc";
import type { Context } from "@1.module/trpc";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import {
  applyWSSHandler,
  type CreateWSSContextFnOptions,
} from "@trpc/server/adapters/ws";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Server } from "http";
import process from "node:process";
import { WebSocketServer } from "ws";
import { z } from "zod";

//

export const ENV = z
  .object({
    SMTP_HOST: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USERNAME: z.string(),
    EMAIL_FROM: z.string().email().default("no-reply@toc-toc.org"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .parse(process.env);

//

function createContext(
  opts: FetchCreateContextFnOptions | CreateWSSContextFnOptions,
) {
  const headers = new Headers(opts.req.headers as Headers);

  // TODO(douglasduteil): parse with the NEXT_AUTH_HEADER zod validator
  return {
    prisma,
    headers: {
      origin: headers.get("origin") ?? "https://toc-toc.org",
      NEXTAUTH_TOKEN: headers.get("NEXTAUTH_TOKEN") ?? "",
    },
    sender: new Email_Sender(),
  } satisfies Context;
}

//

const app = new Hono();

app.all("*", logger(), cors());

app.get("/", (c) =>
  c.json({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router,
    createContext,
  }),
);

app.get("/health", (c) =>
  c.json({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  }),
);

app.get("/ready", async (c) =>
  c.json({
    app: {
      wss: {
        address: wss.address(),
        clients: wss.clients.size,
      },
    },

    database: {
      status: (await prisma.$queryRaw`SELECT 1`) ? "OK" : "FAIL",
    },
  }),
);

//

const server = serve({
  fetch: app.fetch,
  port: Number(process.env["PORT"] ?? 8080),
});

const wss = new WebSocketServer({ server: server as Server, path: "/trpc" });
wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

const { broadcastReconnectNotification } = applyWSSHandler({
  wss,
  router,
  createContext,
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM");
  await Promise.all([
    broadcastReconnectNotification(),
    wss.close(),
    prisma.$disconnect(),
  ]);
  process.exit(1);
});
