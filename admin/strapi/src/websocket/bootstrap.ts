//

import { Notification } from "@1/models";
import { AppContext, appRouter } from "@1/strapi-trpc-router";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import type { Strapi } from "@strapi/strapi";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import { Server, type WebSocket } from "ws";
import { UserEmitterMap } from ".";

//

export default function bootstrap({ strapi }: { strapi: Strapi }) {
  const wss = (strapi.server.wss = new Server({
    server: strapi.server.httpServer,
  }));

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: () =>
      ({
        subscription_to: {
          notifications(id: number) {
            return observable<Notification>((emit) => {
              strapi.log.debug(`+ Notification ${id}`);
              const on_new_answer = (data: number) => {
                emit.next({
                  id: 123,
                  createdAt: new Date(),
                  message: "Hello",
                  state: "pending",
                  subject: "GENERAL",
                  type: "GRETTING",
                  profile: { id: 0 },
                });
              };
              UserEmitterMap.get(id).notifications.on(
                "new_answer",
                on_new_answer,
              );
              return () =>
                UserEmitterMap.get(id).notifications.off(
                  "new_answer",
                  on_new_answer,
                );
            });
          },
          messages(id: number) {
            return observable<Notification>(() => {});
          },
        },

        async verify_jwt(jwt: string) {
          return getService("jwt").verify(jwt) as { id: number };
        },
      }) satisfies AppContext,
  });

  wss.on("connection", onConnection.bind(null, { strapi, wss }));

  return { wss, handler };
}

//

export function onConnection(
  { strapi, wss }: { strapi: Strapi; wss: Server },
  ws: WebSocket,
) {
  strapi.log.debug(`+ Connection (${wss.clients.size})`);
  strapi.log.debug(`+ UserEmitterMap (${UserEmitterMap.streams.size})`);

  ws.once("close", () => {
    strapi.log.debug(`- Connection (${wss.clients.size})`);
    strapi.log.debug(`- UserEmitterMap (${UserEmitterMap.streams.size})`);
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
