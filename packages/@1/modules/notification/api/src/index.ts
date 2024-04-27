//

import {
  Notification_Schema,
  type Notification,
} from "@1.modules/notification.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const notification_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Notification_Schema.parse(
        await prisma.notification.findFirstOrThrow({ where: { id } }),
      ) as Notification;
    }),
});

export default notification_api_router;
export type NotificationApiRouter = typeof notification_api_router;
