//

import {
  Partner_Schema,
  Profile_Schema,
  Studient_Schema,
  type Partner,
  type Profile,
  type Studient,
} from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const profile_api_router = router({
  by_email: next_auth_procedure
    .input(z.string())
    .query(async ({ input: email, ctx: { prisma } }) => {
      return Profile_Schema.parse(
        await prisma.profile.findFirstOrThrow({ where: { user: { email } } }),
        { path: ["<by_email>.prisma.profile.findFirstOrThrow"] },
      ) as Profile;
    }),

  //

  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Profile_Schema.parse(
        await prisma.profile.findFirstOrThrow({ where: { id } }),
        { path: ["<by_id>.prisma.profile.findFirstOrThrow"] },
      ) as Profile;
    }),

  //

  studient: router({
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
  }),

  //

  partner: router({
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
  }),

  //

  me: router({
    update: next_auth_procedure
      .input(Profile_Schema.omit({ id: true, role: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id } = payload.profile;
        return prisma.profile.update({
          data: input,
          where: { id },
        });
      }),
  }),
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
