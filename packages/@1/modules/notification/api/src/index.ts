//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { NotificationType } from "@prisma/client";
import { P, match } from "ts-pattern";
import { z } from "zod";
import find from "./find";

//

const notification_api_router = router({
  count_unread: next_auth_procedure
    .input(
      z.object({
        type: z
          .enum(["EXCHANGE", NotificationType.INBOX_NEW_MESSAGE])
          .optional(),
      }),
    )
    .query(async ({ input: { type }, ctx: { prisma, payload } }) => {
      const { id: owner_id } = payload.profile;

      const sub_count = await match(type)
        .with(NotificationType.INBOX_NEW_MESSAGE, async () => {
          const data = await prisma.inboxMessageNotification.findMany({
            select: { message: { select: { thread_id: true } } },
            where: {
              notification: {
                owner_id,
                read_at: null,
                type: NotificationType.INBOX_NEW_MESSAGE,
              },
            },
          });
          return new Set(data.map(({ message }) => message?.thread_id));
        })
        .with("EXCHANGE", async () => {
          const data = await prisma.exchangeMessageNotification.findMany({
            select: { message: { select: { thread_id: true } } },
            where: {
              notification: {
                owner_id,
                read_at: null,
                type: {
                  in: [
                    NotificationType.EXCHANGE_NEW_MESSAGE,
                    NotificationType.EXCHANGE_NEW_PARTICIPANT,
                  ],
                },
              },
            },
          });
          return new Set(data.map(({ message }) => message?.thread_id));
        })
        .otherwise(() => Promise.resolve(null));

      if (sub_count) return sub_count.size;

      const notification_type = match(type)
        .with("EXCHANGE", () => ({
          type: {
            in: [
              NotificationType.EXCHANGE_NEW_MESSAGE,
              NotificationType.EXCHANGE_NEW_PARTICIPANT,
            ],
          },
        }))
        .with(NotificationType.INBOX_NEW_MESSAGE, () => ({
          type: NotificationType.INBOX_NEW_MESSAGE,
        }))
        .with(P.nullish, () => ({}))
        .exhaustive();

      return prisma.notification.count({
        where: { owner_id, read_at: null, ...notification_type },
      });
    }),
  find,
});

export default notification_api_router;
