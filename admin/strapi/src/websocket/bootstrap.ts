//

import { New_Answer_Schema_To_Domain } from "@1/modules/notification/infra/strapi";
import { Profile_RecordToDomain } from "@1/modules/profile/infra/strapi";
import { appRouter, type AppContext } from "@1/strapi-trpc-router";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import type { Strapi } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import { Server, type WebSocket } from "ws";
import type { GetValues } from "~/types";
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
            return observable((emit) => {
              strapi.log.silly(`+ Notification ${id}`);
              const on_new_answer = async (comment_id: number) => {
                strapi.log.silly(
                  `*** on_new_answer (user ${id}) (comment_id ${comment_id})`,
                );
                const entityService: EntityService = strapi?.entityService;

                if (Number.isNaN(comment_id)) return;

                const comment: (Comment & { createdAt: string }) | undefined =
                  await entityService.findOne(
                    "plugin::comments.comment",
                    comment_id,
                    { populate: { authorUser: true } },
                  );

                const user_id = comment?.authorUser?.id;
                if (!user_id) return;

                const profile_record: GetValues<"api::user-profile.user-profile"> & {
                  id: number;
                } = await strapi
                  .service("api::user-profile.user-profile")
                  .findOneFromUser(user_id);
                const profile_option = new Profile_RecordToDomain().build(
                  profile_record,
                );

                if (profile_option.isFail()) {
                  strapi.log.error(profile_option.error());
                  return;
                }

                const new_answer_record = {
                  answer: { id: Number(comment.id) },
                  createdAt: new Date(comment.createdAt),
                  profile: profile_option.value(),
                  question: { id: 0 },
                  subject: "Q&A",
                  type: "NEW_ANSWER",
                };

                const new_answer = new New_Answer_Schema_To_Domain().build(
                  new_answer_record,
                );
                if (new_answer.isFail()) return;

                emit.next(new_answer.value().toObject());
                strapi.log.silly(`++ ${id} notifications/on_new_answer`);
              };

              UserEmitterMap.get(id).notifications.on(
                "new_answer",
                on_new_answer,
              );
              strapi.log.silly(`+ ${id} notifications`);

              return () => {
                strapi.log.silly(`- ${id} notifications`);
                UserEmitterMap.get(id).notifications.off(
                  "new_answer",
                  on_new_answer,
                );
              };
            });
          },
          messages(id: number) {
            return observable(() => {});
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
