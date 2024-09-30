"use server";

import prisma, { type Prisma } from "@1.infra/database";
import { AuthError, ProfileNotFoundError } from "@1.modules/core/errors";
import {
  NewPartner_Schema,
  NewProfile_Schema,
  NewStudent_Schema,
} from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { match } from "ts-pattern";
import z from "zod";
import { createServerActionProcedure } from "zsa";
import { auth, signIn } from "../auth.config";

const is_auth_user_procedure = createServerActionProcedure().handler(
  async () => {
    const session = await auth();
    if (!session) throw new AuthError("No session");
    if (!session.user) throw new AuthError("No user");
    if (!session.user.id) throw new AuthError("No user id");
    if (!session.user.email) throw new AuthError("No user email");
    return {
      session: {
        user_id: session.user.id,
        user_email: session.user.email,
      },
    };
  },
);

const input_schema = NewProfile_Schema.extend({
  bio: z.string().trim().default(""),
  context: z.any(),
});

export type Input = z.infer<typeof input_schema>;
export default is_auth_user_procedure
  .createServerAction()
  .input(input_schema)
  .handler(
    async ({
      input,
      ctx: {
        session: { user_id, user_email: email },
      },
    }) => {
      const image = gravatarUrlFor(email);
      const profile = await prisma.user.update({
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
        where: { id: user_id },
      });

      if (!profile) throw new ProfileNotFoundError("Profile not found");

      return signIn("nodemailer", { email });
    },
  );

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
