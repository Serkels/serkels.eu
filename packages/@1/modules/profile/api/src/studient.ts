import { Studient_Schema, type Studient } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

export const studient = router({
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
});
