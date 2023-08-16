//

import type { Strapi } from "@strapi/strapi";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { Server, WebSocket } from "ws";
import { appRouter, createContext } from "./router";

//

export default function bootstrap({ strapi }: { strapi: Strapi }) {
  const wss = (strapi.server.wss = new Server({
    server: strapi.server.httpServer,
  }));

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext,
  });

  wss.on("connection", onConnection.bind(null, { strapi, wss }));

  return { wss, handler };
}

//

export function onConnection(
  { strapi, wss }: { strapi: Strapi; wss: Server<WebSocket> },
  ws: WebSocket,
) {
  strapi.log.debug(`+ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    strapi.log.debug(`- Connection (${wss.clients.size})`);
  });
}

//

export async function destroyWss(wss?: Server) {
  if (!wss) return;
  wss.close();
}

export async function destroyWSSHandler(
  handler?: ReturnType<typeof applyWSSHandler>,
) {
  if (!handler) return;
  handler.broadcastReconnectNotification();
}
