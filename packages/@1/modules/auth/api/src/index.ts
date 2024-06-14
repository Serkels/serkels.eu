//

import { SerkelsMagicLinkEmail } from "@1.modules/auth.emails";
import {
  PROFILE_ROLES,
  Partner_Schema,
  Profile_Schema,
  Student_Schema,
  type Profile,
} from "@1.modules/profile.domain";
import { gravatarUrlFor } from "@1.modules/profile.domain/gravatarUrlFor";
import { next_auth_procedure, router, type Context } from "@1.modules/trpc";
import create_NextAuth_router from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
import create_EmailProvider_router, {
  type SendEmailResolverFn,
} from "@douglasduteil/nextauth...trpc.prisma/trpc/router/email";
import { Prisma, ProfileRole } from "@prisma/client";
import process from "node:process";
import { match } from "ts-pattern";
import { z } from "zod";

//

const ENV = z
  .object({
    NEXTAUTH_SECRET: z.string(),
    JWT_EXPIRE_PERIOD: z.string().default("30d"),
    MAGIC_TOKEN_LENGHT: z.coerce.number().default(32),
    MAGIC_TOKEN_EXPIRE_PERIOD: z.coerce.number().default(1), // 1 day
  })
  .parse(process.env);

//

const send_email_resolver: SendEmailResolverFn<Context> = async ({
  input,
  ctx,
}) => {
  const { identifier, url } = input;

  await ctx.sender.send_react_email(
    SerkelsMagicLinkEmail({ base_url: ctx.headers.origin, url }),
    {
      subject: "[Serkels] Connexion",
      to: identifier,
    },
  );
};

//

const auth_api_router = router({
  next_auth_adapter: create_NextAuth_router(ENV.NEXTAUTH_SECRET),
  next_auth_provider: create_EmailProvider_router(ENV.NEXTAUTH_SECRET, {
    resolver: send_email_resolver,
  }),

  //

  payload: router({
    link: next_auth_procedure
      .input(
        z.object({
          identifier: z.string(),
          name: z.string(),
          role: PROFILE_ROLES,
          token: z.string(),
          context: z.any(),
        }),
      )
      .mutation(async ({ input, ctx: { prisma } }) => {
        const existing_payload = await prisma.signupPayload.findUnique({
          where: { email: input.identifier },
        });

        if (existing_payload) {
          return prisma.signupPayload.update({
            data: { tokens: { connect: { token: input.token } } },
            where: { email: input.identifier },
          });
        }

        return prisma.signupPayload.create({
          data: {
            name: input.name,
            email: input.identifier,
            role: ProfileRole[input.role],
            tokens: { connect: { token: input.token } },
            context: input.context,
          },
        });
      }),

    use_payload: next_auth_procedure
      .input(z.string())
      .mutation(async ({ input: email, ctx: { prisma } }) => {
        const [user, payload] = await Promise.all([
          prisma.user.findUniqueOrThrow({
            where: { email },
          }),
          prisma.signupPayload.delete({
            where: { email },
          }),
        ]);

        const image = gravatarUrlFor(email);
        const bio = z
          .object({ bio: z.string().default("") })
          .parse(payload.context).bio;

        //

        const profile_role_data = match(payload.role)
          .with("ADMIN", () => ({}))
          .with("PARTNER", function () {
            const partner_context = Partner_Schema.omit({
              id: true,
              profile: true,
            }).parse(payload.context, { path: ["payload.context"] });

            return {
              partner: {
                create: partner_context as Omit<
                  Prisma.PartnerCreateInput,
                  "profile"
                >,
              },
            };
          })
          .with("STUDENT", function () {
            const student_context = Student_Schema.omit({
              id: true,
              interest: true,
              profile: true,
            }).parse(payload.context, { path: ["payload.context"] });
            return {
              student: {
                create: student_context as Omit<
                  Prisma.StudentCreateInput,
                  "profile"
                >,
              },
            };
          })
          .exhaustive();

        //

        const record = await prisma.user.update({
          where: { id: user.id },
          data: {
            image,
            name: payload.name,
            profile: {
              create: {
                image,
                name: payload.name,
                role: ProfileRole[payload.role],
                bio,
                ...profile_role_data,
              },
            },
          },
          include: {
            profile: true,
          },
        });

        return Profile_Schema.parse(record.profile) as Profile;
      }),
  }),
});

export default auth_api_router;
export type AuthApiRouter = typeof auth_api_router;
