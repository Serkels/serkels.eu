//

import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

// TODO(douglasduteil): consider moving this to the toggle folder
// It's toggling the presence of a profile in the blacklist
export default router({
  find: next_auth_procedure
    .input(z.object({ profile_id: ID_Schema }))
    .query(async ({ input: { profile_id }, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;
      const profile_id_owner_id = { owner_id: id, profile_id };
      return prisma.blacklist.findUnique({
        select: {
          owner_id: true,
          profile: { select: { id: true, name: true, image: true } },
        },
        where: { profile_id_owner_id },
      });
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
