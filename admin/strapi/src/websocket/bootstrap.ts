//

import { getService } from "@strapi/plugin-users-permissions/server/utils";
import type { Strapi } from "@strapi/strapi";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { Server, WebSocket } from "ws";

import { AppContext, appRouter } from "@1/strapi-trpc-router";
import { UserEmitterMap } from ".";

//

export default function bootstrap({ strapi }: { strapi: Strapi }) {
  UserEmitterMap.get(34);

  const wss = (strapi.server.wss = new Server({
    server: strapi.server.httpServer,
  }));

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: () =>
      ({
        greeting() {
          console.log("from greeting");
          return Promise.resolve("Hello DinoOo");
        },

        async verify_jwt(jwt: string) {
          return getService("jwt").verify(jwt) as { id: number };
        },
        emitters: new Map(),
        async get_my_notifications(limit: number): Promise<Notification[]> {
          limit;
          return [
            {
              id: 123,
              createdAt: new Date(),
              message: "Hello",
              state: "pending",
              subject: "GENERAL",
              type: "GRETTING",
              profile: { id: 0 },
            },
          ];
        },
      }) satisfies AppContext,
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
