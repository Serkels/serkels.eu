//

import { NotificationType } from "@1.infra/database";
import { NotificationGroup } from "@1.modules/notification.domain";
import { router, session_procedure } from "@1.modules/trpc";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

const EXCHANGE_NOTIFICATIONS = [
  NotificationType.EXCHANGE_COMPLETED,
  NotificationType.EXCHANGE_NEW_MESSAGE,
  NotificationType.EXCHANGE_NEW_PARTICIPANT,
];

//

export default router({
  count_unread: session_procedure
    .input(
      z.object({
        type: NotificationGroup.optional(),
      }),
    )
    .query(async ({ input: { type }, ctx: { prisma, session } }) => {
      const { id: owner_id } = session.profile;

      const sub_count = await match(type)
        .with(NotificationGroup.Enum.INBOX, async () => {
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
        .with(NotificationGroup.Enum.EXCHANGE, async () => {
          const data = await prisma.exchangeMessageNotification.findMany({
            select: { message: { select: { thread_id: true } } },
            where: {
              notification: {
                owner_id,
                read_at: null,
                type: {
                  in: EXCHANGE_NOTIFICATIONS,
                },
              },
            },
          });
          return new Set(data.map(({ message }) => message?.thread_id));
        })
        .otherwise(() => Promise.resolve(null));

      if (sub_count) return sub_count.size;

      const notification_type = match(type)
        .with(NotificationGroup.Enum.EXCHANGE, () => ({
          type: {
            in: EXCHANGE_NOTIFICATIONS,
          },
        }))
        .with(NotificationGroup.Enum.INBOX, () => ({
          type: NotificationType.INBOX_NEW_MESSAGE,
        }))
        .with(P.nullish, () => ({}))
        .exhaustive();

      return prisma.notification.count({
        where: { owner_id, read_at: null, ...notification_type },
      });
    }),
});
