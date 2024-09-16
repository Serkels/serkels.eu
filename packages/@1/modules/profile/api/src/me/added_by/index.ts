//

import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, router, with_next_cursor } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

export default router({
  find: next_auth_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;
      const { cursor, limit } = input;
      const maybe_cursor = cursor ? { id: cursor } : {};
      const data =
        (await prisma.profile
          .findUnique({
            select: {
              in_contact_with: {
                select: {},
                ...maybe_cursor,
              },
            },
            where: { id },
          })
          .in_contact_with({
            select: { id: true, image: true, name: true },
          })) ?? [];

      return with_next_cursor(limit, data)(({ id }) => id);
    }),

  toggle: next_auth_procedure
    .input(z.object({ profile_id: ID_Schema }))
    .mutation(async ({ input: { profile_id }, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;
      const profile_id_owner_id = { owner_id: id, profile_id };
      const existing = await prisma.blacklist.findUnique({
        select: { owner_id: true, profile_id: true },
        where: { profile_id_owner_id },
      });

      return match(existing)
        .with(null, () => {
          return prisma.blacklist.create({
            data: profile_id_owner_id,
          });
        })
        .otherwise(() => {
          return prisma.blacklist.delete({
            where: { profile_id_owner_id },
          });
        });
    }),
});
