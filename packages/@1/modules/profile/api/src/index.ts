//

import { startSpan } from "@1.modules/core/telemetry";
import { Profile_Schema, type Profile } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import { me } from "./me";
import { partner_api_router } from "./partner";
import { student_api_router } from "./student";

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
    .query(({ input: id, ctx: { prisma } }) => {
      return startSpan(
        {
          name: `prisma.profile.findFirstOrThrow(${id})`,
          op: "prisma",
        },
        function findFirstOrThrow() {
          return prisma.profile.findUniqueOrThrow({
            include: {
              in_contact_with: { select: { id: true } },
              contacts: { select: { id: true } },
            },
            where: { id },
          });
        },
      );
    }),

  //

  /**
   * @deprecated use flatten style
   */
  student: student_api_router,

  //

  /**
   * @deprecated use flatten style
   */
  partner: partner_api_router,

  //

  me: me,
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
