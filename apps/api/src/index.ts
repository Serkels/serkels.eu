//

import "./dotenv";

//

import prisma from "@1.infra/database";
import { Email_Sender } from "@1.infra/email";
import { router } from "@1.infra/trpc";
import { HTTPError } from "@1.modules/core/errors";
import type { Context } from "@1.modules/trpc";
import { serve } from "@hono/node-server";
import { sentry } from "@hono/sentry";
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
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    //
    EMAIL_FROM: z.string().email().default("no-reply@toc-toc.org"),
    SENTRY_DSN: z.string().url(),
    SMTP_HOST: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USERNAME: z.string(),
  })
  .parse(process.env);

//

function createContext(
  opts: FetchCreateContextFnOptions | CreateWSSContextFnOptions,
) {
  const headers = new Headers(opts.req.headers as Headers);

  // TODO(douglasduteil): parse with the NEXT_AUTH_HEADER zod validator
  return {
    prisma: prisma,
    headers: {
      origin: headers.get("origin") ?? "https://toc-toc.org",
      NEXTAUTH_TOKEN: headers.get("NEXTAUTH_TOKEN") ?? "",
    },
    sender: new Email_Sender(),
  } satisfies Context;
}

//

const app = new Hono();

app.all(
  "*",
  sentry({ dsn: ENV.SENTRY_DSN, debug: ENV.NODE_ENV === "development" }),
  logger(),
  cors(),
);

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

app.get("/sentry-example-api/:name", async (c) => {
  const name = c.req.param("name");
  if (name) throw new HTTPError(`Sentry Example API Route Error ${name}`);
  return c.json({ data: "Testing Sentry Error..." });
});

app.onError(function on_error(err, c) {
  console.error(err);
  c.status(500);
  return c.json({
    error: err.message,
    stack: ENV.NODE_ENV === "development" ? err.stack : undefined,
  });
});

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
