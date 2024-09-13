//

import { NotificationType, type Prisma } from "@1.infra/database";
import { next_auth_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default next_auth_procedure
  .input(z.string())
  .mutation(async ({ input: profile_id, ctx: { prisma, payload } }) => {
    const { id } = payload.profile;
    const existing = await prisma.profile.findUnique({
      select: { id: true },
      where: { id, contacts: { some: { id: profile_id } } },
    });

    const data: Prisma.ProfileUpdateInput = existing
      ? { contacts: { disconnect: { id: profile_id } } }
      : {
          added_notifications: {
            create: {
              notification: {
                create: {
                  type: NotificationType.PROFILE_ADDED,
                  owner_id: profile_id,
                },
              },
            },
          },
          contacts: { connect: { id: profile_id } },
        };

    return prisma.profile.update({
      data,
      where: { id },
    });
  });
