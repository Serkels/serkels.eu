//

import { next_auth_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default next_auth_procedure
  .input(z.object({ notification_id: z.string() }))
  .mutation(async ({ input, ctx: { prisma, payload } }) => {
    const { notification_id } = input;
    const { id: owner_id } = payload.profile;
    return prisma.notification.update({
      data: { read_at: new Date() },
      where: { id: notification_id, owner_id },
    });
  });
