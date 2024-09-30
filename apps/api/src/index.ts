//

import "./dotenv";

//

import prisma from "@1.infra/database";
import { Email_Sender, ENV as EmailEnv } from "@1.infra/email";
import { router } from "@1.infra/trpc";
import { env_app_url_schema } from "@1.modules/core/env.zod";
import { HTTPError } from "@1.modules/core/errors";
import type { Context } from "@1.modules/trpc";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import {
  addRequestDataToEvent,
  continueTrace,
  getCurrentScope,
  httpIntegration,
  init as init_sentry,
  postgresIntegration,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  setHttpStatus,
  startSpan,
  withScope,
} from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
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

const { APP_URL } = env_app_url_schema.parse(process.env);
export const ENV = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    //
    EMAIL_FROM: z.string().email().default("no-reply@toc-toc.org"),
    SENTRY_DSN: z.string().url(),
  })
  .merge(EmailEnv)
  .parse(process.env);

//

function createContext(
  opts: FetchCreateContextFnOptions | CreateWSSContextFnOptions,
) {
  const headers = new Headers(opts.req.headers as Headers);

  return {
    prisma,
    headers: {
      origin: headers.get("origin") ?? APP_URL,
      NEXTAUTH_TOKEN: headers.get("NEXTAUTH_TOKEN") ?? "",
    },
    sender: new Email_Sender(ENV),
  } satisfies Context;
}

//

const app = new Hono();

init_sentry({
  enabled: ENV.NODE_ENV === "production",
  dsn: ENV.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: ENV.NODE_ENV,
  integrations: [
    postgresIntegration(),
    httpIntegration(),
    nodeProfilingIntegration(),
  ],
  profilesSampleRate: 0.1,
});

app.all(
  "*",
  async (c, next) => {
    if (
      c.req.method.toUpperCase() === "OPTIONS" ||
      c.req.method.toUpperCase() === "HEAD"
    ) {
      return next();
    }

    return withScope(function with_scope_callback(scope) {
      const sentryTrace = c.req.header("sentry-trace")
        ? c.req.header("sentry-trace")
        : undefined;
      const baggage = c.req.header("baggage");
      const { url, method, path } = c.req;
      const headers: Record<string, string> = {};
      c.res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      scope.setTransactionName(`${method} ${path}`);
      scope.setSDKProcessingMetadata({
        request: {
          url,
          method,
          headers,
        },
      });

      return continueTrace(
        { sentryTrace, baggage },
        function continue_trace_callback() {
          return startSpan(
            {
              attributes: {
                [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.node",
                "http.request.method": c.req.method || "GET",
                [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url",
              },
              op: "http.server",
              name: `${c.req.method} ${c.req.path || "/"}`,
            },
            async function start_span_callback(span) {
              scope.addEventProcessor(function event_processor_callback(event) {
                return addRequestDataToEvent(
                  event,
                  {
                    method: c.req.method,
                    url: c.req.url,
                  },
                  {
                    include: {
                      user: false,
                    },
                  },
                );
              });
              await next();

              if (!span) {
                return;
              }

              setHttpStatus(span, c.res.status);
              scope.setContext("response", {
                headers,
                status_code: c.res.status,
              });
            },
          );
        },
      );
    });
  },
  logger(),
  cors(),
);

app.get("/", (c) =>
  c.json({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    sentry_scope: getCurrentScope().getScopeData(),
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
