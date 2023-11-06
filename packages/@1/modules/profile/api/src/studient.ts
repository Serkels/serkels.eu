import { Studient_Schema, type Studient } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

export const studient_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.studient.findUniqueOrThrow({
        where: { id },
      });
    }),

  by_profile_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma } }) => {
      return Studient_Schema.parse(
        await prisma.studient.findFirstOrThrow({
          where: { profile_id },
          include: { interest: true, profile: true },
        }),
        {
          path: ["<studient.by_profile_id>.prisma.studient.findFirstOrThrow"],
        },
      ) as Studient;
    }),
  //

  me: router({
    update: next_auth_procedure
      .input(Studient_Schema.omit({ id: true, profile: true, interest: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id: profile_id } = payload.profile;
        return prisma.studient.update({
          data: {
            ...input,
          },
          where: { profile_id },
        });
      }),
  }),
});
