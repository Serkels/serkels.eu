//

import { Profile_Schema, type Profile } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import { me } from "./me";
import { partner } from "./partner";
import { studient_api_router } from "./studient";

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
      return prisma.profile.findFirstOrThrow({
        include: {
          followed_by: { select: { id: true } },
          in_contact_with: { select: { id: true } },
        },
        where: { id },
      });
    }),

  //

  studient: studient_api_router,

  //

  partner,

  //

  me,
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
