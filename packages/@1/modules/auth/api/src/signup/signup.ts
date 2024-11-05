//

import type { Prisma } from "@1.infra/database";
import {
  NewPartner_Schema,
  NewProfile_Schema,
  NewStudent_Schema,
} from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { maybe_session_procedure, router, TRPCError } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

const schema = NewProfile_Schema.extend({
  bio: z.string().trim().default(""),
  context: z.any(),
});
export type Input = z.infer<typeof schema>;
export default router({
  signup: maybe_session_procedure
    .input(schema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      if (!session?.user?.email)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "User session not found",
        });
      const {
        user: { email },
      } = session;
      const image = gravatarUrlFor(email);

      const profile = await prisma.user
        .update({
          data: {
            image,
            name: input.name,
            profile: {
              create: {
                bio: input.bio,
                name: input.name,
                role: input.role,
                image,
                ...create_profile_role_data(input),
              },
            },
          },
          select: { id: true },
          where: { email },
        })
        .profile({ select: { id: true } });

      return profile;
    }),
});

function create_profile_role_data(input: Input) {
  return match(input.role)
    .with("ADMIN", () => ({}))
    .with("PARTNER", function (): Pick<
      Prisma.ProfileCreateWithoutUserInput,
      "partner"
    > {
      const partner_context = NewPartner_Schema.parse(input.context, {
        path: ["input.context"],
      });

      return {
        partner: {
          create: partner_context,
        },
      };
    })
    .with("STUDENT", function (): Pick<
      Prisma.ProfileCreateWithoutUserInput,
      "student"
    > {
      const student_context = NewStudent_Schema.parse(input.context, {
        path: ["input.context"],
      });
      const { interest_id, ...other_student_context } = student_context;
      return {
        student: {
          create: {
            ...other_student_context,
            interest: { connect: { id: interest_id } },
          },
        },
      };
    })
    .exhaustive();
}
