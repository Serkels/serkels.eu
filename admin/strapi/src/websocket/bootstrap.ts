//

import { appRouter } from "@1/strapi-trpc-router";
import type { Strapi } from "@strapi/strapi";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { Server, type WebSocket } from "ws";
import { UserEmitterMap } from ".";
import AppContext from "./AppContext";

//

export default function bootstrap({ strapi }: { strapi: Strapi }) {
  const wss = (strapi.server.wss = new Server({
    server: strapi.server.httpServer,
  }));

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    onError(error) {
      console.error(error.error);
      strapi.log.error(error.error);
    },
    createContext: () => AppContext,
  });

  wss.on("connection", onConnection.bind(null, { strapi, wss }));

  return { wss, handler };
}

//

export function onConnection(
  { strapi, wss }: { strapi: Strapi; wss: Server },
  ws: WebSocket,
) {
  strapi.log.silly(`+ Connection (${wss.clients.size})`);
  strapi.log.silly(`+ UserEmitterMap (${UserEmitterMap.streams.size})`);

  ws.once("close", () => {
    strapi.log.silly(`- Connection (${wss.clients.size})`);
    strapi.log.silly(`- UserEmitterMap (${UserEmitterMap.streams.size})`);
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
