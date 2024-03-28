import { Profile_Schema } from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { create_report } from "@1.modules/profile.domain/report";
import { next_auth_procedure, router } from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

//

const follow = router({
  find: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;

      return prisma.profile.findUnique({
        where: { id, following: { some: { id: profile_id } } },
      });
    }),

  //

  toggle: next_auth_procedure
    .input(z.string())
    .mutation(async ({ input: profile_id, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;

      const existing = await prisma.profile.findUnique({
        include: { following: true },
        where: { id, following: { some: { id: profile_id } } },
      });

      const data: Prisma.ProfileUpdateInput = existing
        ? { following: { disconnect: { id: profile_id } } }
        : { following: { connect: { id: profile_id } } };

      return prisma.profile.update({
        data,
        where: { id },
      });
    }),
});

const contact = router({
  find: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;

      return prisma.profile.findUnique({
        where: { id, contacts: { some: { id: profile_id } } },
      });
    }),

  //

  toggle: next_auth_procedure
    .input(z.string())
    .mutation(async ({ input: profile_id, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;

      const existing = await prisma.profile.findUnique({
        include: { contacts: true },
        where: { id, contacts: { some: { id: profile_id } } },
      });

      const data: Prisma.ProfileUpdateInput = existing
        ? { contacts: { disconnect: { id: profile_id } } }
        : { contacts: { connect: { id: profile_id } } };

      return prisma.profile.update({
        data,
        where: { id },
      });
    }),
});

export const me = router({
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

  //

  /**
   * @deprecated use profile.contacts.find directly
   */
  find_contact: contact.find,

  //

  /**
   * @deprecated use profile.contacts.find directly
   */
  toggle_contact: contact.toggle,

  //

  follow,

  //

  update_image_to_gravatar: next_auth_procedure.mutation(
    async ({ ctx: { prisma, payload } }) => {
      const { id } = payload.profile;
      const { email } = await prisma.user.findFirstOrThrow({
        where: { profile: { id } },
      });
      const image = gravatarUrlFor(email ?? "");

      return prisma.profile.update({
        data: {
          image,
          user: { update: { image: image } },
        },
        where: { id },
      });
    },
  ),

  //

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

  //

  report: next_auth_procedure
    .input(create_report)
    .mutation(({ ctx, input }) => {
      const { email, link, comment } = input;
      const text = `
      Report from ${email}

      - Link: ${link}

      - Comment:
      ${comment}
      `;
      return ctx.sender.send({
        from: email,
        replyTo: email,
        to: "tyree.braun84@ethereal.email",
        subject: "Report",
        text: text,
      });
    }),
});
