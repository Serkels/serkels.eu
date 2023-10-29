//

import { Entity_Schema } from "@1.modules/core/domain";
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
      return Profile_Schema.extend({
        followed_by: z.array(Entity_Schema),
      }).parse(
        await prisma.profile.findFirstOrThrow({
          include: { followed_by: true },
          where: { id },
        }),
        {
          path: ["<by_id>.prisma.profile.findFirstOrThrow"],
        },
      );
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
    contacts: next_auth_procedure
      .input(
        z.object({
          cursor: z.string().optional(),
          limit: z.number().min(1).max(10).default(10),
        }),
      )
      .query(async ({ input, ctx: { prisma, payload } }) => {
        const {
          profile: { id },
        } = payload;
        const { cursor, limit } = input;
        const { contacts: data } = await prisma.profile.findUniqueOrThrow({
          select: {
            contacts: {
              ...(cursor ? { cursor: { id: cursor } } : {}),
              take: limit + 1,
              orderBy: { name: "asc" },
            },
          },
          where: { id },
        });

        let next_cursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const next_item = data.pop()!;
          next_cursor = next_item.id;
        }

        return { data, next_cursor };
      }),

    update: next_auth_procedure
      .input(Profile_Schema.omit({ id: true, role: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id } = payload.profile;
        return prisma.profile.update({
          data: {
            ...input,
            user: { update: { image: input.image, name: input.name } },
          },
          where: { id },
        });
      }),
  }),
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
