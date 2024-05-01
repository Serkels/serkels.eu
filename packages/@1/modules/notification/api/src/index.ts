//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { NotificationType } from "@prisma/client";
import { match } from "ts-pattern";
import { z } from "zod";
import find from "./find";

//

const notification_api_router = router({
  count_unread: next_auth_procedure
    .input(
      z.object({
        type: z.enum([NotificationType.INBOX_NEW_MESSAGE]).optional(),
      }),
    )
    .query(async ({ input: { type }, ctx: { prisma, payload } }) => {
      const { id: owner_id } = payload.profile;
      const sub_count = await match(type)
        .with("INBOX_NEW_MESSAGE", async () => {
          const data = await prisma.inboxMessageNotification.findMany({
            select: { message: { select: { thread_id: true } } },
            where: { notification: { owner_id, read_at: null } },
          });
          return new Set(data.map(({ message: { thread_id } }) => thread_id));
        })
        .otherwise(() => Promise.resolve(null));

      if (sub_count) return sub_count.size;
      return prisma.notification.count({
        where: { owner_id, read_at: null, ...(type ? { type } : {}) },
      });
    }),
  find,
});

export default notification_api_router;