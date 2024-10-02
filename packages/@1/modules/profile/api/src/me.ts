//

import { Profile_Schema } from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { create_report } from "@1.modules/profile.domain/report";
import {
  next_auth_procedure,
  router,
  session_procedure,
  with_next_cursor,
} from "@1.modules/trpc";
import { z } from "zod";
import added_by from "./me/added_by";
import blacklist from "./me/blacklist";
import toggle_add_contact from "./me/toggle";

//

const contact = router({
  find_by_profile_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;

      return prisma.profile.findUnique({
        where: { id, contacts: { some: { id: profile_id } } },
      });
    }),

  //

  toggle: toggle_add_contact,
});

const contacts = next_auth_procedure
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

    return with_next_cursor(limit, data)(({ id }) => id);
  });

const update_image_to_gravatar = next_auth_procedure.mutation(
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
);

const update = next_auth_procedure
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
  });

//

const report = session_procedure
  .input(create_report)
  .mutation(({ ctx, input }) => {
    const { attachments, email, link, comment, category } = input;
    const text = `
  # ${email} signal ${category}

  - Lien: ${link}

  - Commentaire :
  ${comment}
  `;
    return ctx.sender.send_report({
      replyTo: email,
      subject: `[Signalement] ${category} (${link})`,
      text: text,
      attachments: attachments ? [{ path: attachments }] : undefined,
    });
  });

export const me = router({
  added_by,
  blacklist,
  contact,
  contacts,
  report,
  update_image_to_gravatar,
  update,
});
