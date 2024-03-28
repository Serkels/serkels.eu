import { Partner_Schema, type Partner } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export const partner_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.partner.findUniqueOrThrow({
        where: { id },
      });
    }),

  by_profile_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma } }) => {
      return Partner_Schema.parse(
        await prisma.partner.findFirstOrThrow({
          where: { profile_id },
          include: { profile: true },
        }),
        {
          path: ["<partner.by_profile_id>.prisma.studient.findFirstOrThrow"],
        },
      ) as Partner;
    }),

  //

  me: router({
    update: next_auth_procedure
      .input(Partner_Schema.omit({ id: true, profile: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id: profile_id } = payload.profile;
        return prisma.partner.update({
          data: {
            ...input,
            updated_at: new Date(),
          },
          where: { profile_id },
        });
      }),
  }),
});
