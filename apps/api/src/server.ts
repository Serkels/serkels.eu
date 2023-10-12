//

import { appRouter } from "@toctocorg/api";
import {
  CreateHTTPContextOptions,
  createHTTPServer,
} from "@trpc/server/adapters/standalone";
import {
  CreateWSSContextFnOptions,
  applyWSSHandler,
} from "@trpc/server/adapters/ws";
import cors from "cors";
import { AddressInfo } from "net";
import { WebSocketServer } from "ws";

//

// This is how you initialize a context for the server
function createContext(
  opts: CreateHTTPContextOptions | CreateWSSContextFnOptions,
) {
  return {};
}

export type AppRouter = typeof appRouter;

// http server
const { server, listen } = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

// ws server
const wss = new WebSocketServer({ server, path: "/socket" });
wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

applyWSSHandler({
  batching: { enabled: true },
  wss,
  router: appRouter,
  createContext,
});

// setInterval(() => {
//   console.log('Connected clients', wss.clients.size);
// }, 1000);
const port = Number(process.env.PORT) || 2022;
listen(port);

const info = server.address() as AddressInfo;
console.log(`🎠\n - Local:  http://${info.address}:${info.port}`);
