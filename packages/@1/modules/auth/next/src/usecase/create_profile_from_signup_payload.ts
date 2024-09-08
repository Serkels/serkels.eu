//

import type { Prisma, PrismaClient } from "@1.infra/database";
import {
  Partner_Schema,
  Student_Schema,
  type AuthProfile,
} from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { match } from "ts-pattern";
import { startSpan } from "@sentry/core";

//

export function CreateProfileFromSignupPayload({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  return (email: string) =>
    startSpan(
      {
        name: `create_profile_from_signup_payload(${email})`,
        op: "@1.modules/auth.next/usecase/create_profile_from_signup_payload",
      },
      async function create_profile_from_signup_payload() {
        const [user, payload] = await Promise.all([
          prisma.user.findUniqueOrThrow({
            select: { id: true },
            where: { email, emailVerified: { not: null } },
          }),
          prisma.signupPayload.delete({
            select: { context: true, role: true, name: true },
            where: { email },
          }),
        ]);

        const image = gravatarUrlFor(email);

        const profile_role_data = match(payload.role)
          .with("ADMIN", () => ({}))
          .with("PARTNER", function (): {
            partner: Prisma.PartnerCreateNestedOneWithoutProfileInput;
          } {
            const partner_context = Partner_Schema.omit({
              id: true,
              profile: true,
            }).parse(payload.context, { path: ["payload.context"] });

            return {
              partner: {
                create: partner_context,
              },
            };
          })
          .with("STUDENT", function (): {
            student: Prisma.StudentCreateNestedOneWithoutProfileInput;
          } {
            const student_context = Student_Schema.omit({
              id: true,
              interest: true,
              profile: true,
            }).parse(payload.context, { path: ["payload.context"] });
            return {
              student: {
                create: student_context,
              },
            };
          })
          .exhaustive();

        //

        const { profile } = await prisma.user.update({
          data: {
            image,
            name: payload.name,
            profile: {
              create: {
                image,
                name: payload.name,
                role: payload.role,
                ...profile_role_data,
              },
            },
          },
          include: {
            profile: true,
          },
          where: { id: user.id },
        });

        return profile as AuthProfile;
      },
    );
}
