//

import { ApiUserProfileUserProfile } from "@/types/generated/contentTypes";
import { Notification, Profile } from "@1/models";
import { AppContext, appRouter } from "@1/strapi-trpc-router";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import type { Strapi } from "@strapi/strapi";
import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import { Comment } from "strapi-plugin-comments/types/contentTypes";
import { Server, type WebSocket } from "ws";
import { UserEmitterMap } from ".";

//

const timer = setInterval(async () => {
  const source = UserEmitterMap.get(34)?.notifications;

  if (!source) {
    return;
  }

  source.emit("new_answer", 89);
}, 6_666);

export type Profile_DTO = ApiUserProfileUserProfile["attributes"] & {
  id: number;
};

abstract class Mapper<T> {
  // public toDomain (raw: any) => T;
  // public toPersistence (t: T) => any;
  // public static toDTO (t: T): DTO;
}
class VinylMap extends Mapper<Profile> {
  public static toDomain(profile: Profile_DTO): Profile {
    return {
      about: String(profile.about),
      createdAt: new Date(String(profile.createdAt)),
      firstname: String(profile.firstname),
      id: profile.id,
      lastname: String(profile.lastname),
      university: String(profile.university),
      updatedAt: new Date(String(profile.updatedAt)),
    };
  }
  public static toPersistence(raw) {}
}

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
              const on_new_answer = async (comment_id: number) => {
                const entityService: EntityService = strapi?.entityService;

                const comment: (Comment & { createdAt: string }) | undefined =
                  await entityService.findOne(
                    "plugin::comments.comment",
                    comment_id,
                    { populate: { authorUser: true } },
                  );

                const user_id = comment?.authorUser?.id;
                if (!user_id) return;

                const profile: Profile_DTO = await strapi
                  .service("api::user-profile.user-profile")
                  .findOneFromUser(user_id);

                if (!profile) return;

                emit.next({
                  answer: { id: Number(comment.id) },
                  createdAt: new Date(comment.createdAt),
                  profile: VinylMap.toDomain(profile),
                  question: { id: 0 },
                  subject: "Q&A",
                  type: "NEW_ANNSWER",
                });
                strapi.log.debug(`++ ${id} notifications/on_new_answer`);
              };

              UserEmitterMap.get(id).notifications.on(
                "new_answer",
                on_new_answer,
              );
              strapi.log.debug(`+ ${id} notifications`);

              return () => {
                strapi.log.debug(`- ${id} notifications`);
                UserEmitterMap.get(id).notifications.off(
                  "new_answer",
                  on_new_answer,
                );
              };
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
