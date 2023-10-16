//

import {
  next_auth_procedure,
  procedure,
  router,
  type Context,
} from "@1.module/trpc";
import { TocTocMagicLinkEmail } from "@1.modules/auth.emails";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import create_NextAuth_router from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
import create_EmailProvider_router, {
  type SendEmailResolverFn,
} from "@douglasduteil/nextauth...trpc.prisma/trpc/router/email";
import { ProfileRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import addDays from "date-fns/addDays";
import { SignJWT } from "jose";
import { nanoid } from "nanoid/async";
import process from "node:process";
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
    TocTocMagicLinkEmail({ base_url: ctx.headers.origin, url }),
    {
      subject: "[Toc Toc] Connexion",
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
    create: next_auth_procedure
      .input(
        z.object({
          identifier: z.string(),
          name: z.string(),
          role: PROFILE_ROLES,
        }),
      )
      .mutation(async ({ input, ctx: { prisma } }) => {
        return prisma.signupPayload.create({
          data: {
            name: input.name,
            email: input.identifier,
            role: ProfileRole[
              input.role.toUpperCase() as Uppercase<typeof input.role>
            ],
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

        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: payload.name,
            profile: {
              create: {
                role: ProfileRole[
                  payload.role.toUpperCase() as Uppercase<typeof payload.role>
                ],
              },
            },
          },
          include: {
            profile: true,
          },
        });

        return user;
      }),
  }),

  //

  passwordless: router({
    magic: procedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        // console.log(ctx)
        const { email } = input;
        const token = await nanoid(ENV.MAGIC_TOKEN_LENGHT);
        // const sender = new Email_Sender();

        // await sender.send_react_email(
        //   TocTocMagicLinkEmail({ token, base_url: ctx.headers.origin }),
        //   {
        //     subject: "[Toc Toc] Connexion",
        //     to: email,
        //   },
        // );

        await ctx.prisma.passwordlessToken.create({
          data: { email, body: token },
        });

        return { sent: true, email: email };
      }),

    login: procedure
      .input(z.object({ token: z.string().trim() }))
      .query(async ({ input, ctx }) => {
        const { id, is_active, created_at, email } =
          await ctx.prisma.passwordlessToken.findUniqueOrThrow({
            where: { body: input.token },
          });

        if (!is_active) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: "Token already active.",
          });
        }

        if (+addDays(created_at, ENV.MAGIC_TOKEN_EXPIRE_PERIOD) < Date.now()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: `Token expired on ${addDays(
              created_at,
              ENV.MAGIC_TOKEN_EXPIRE_PERIOD,
            )}.`,
          });
        }

        await ctx.prisma.passwordlessToken.update({
          data: { is_active: false, login_date: new Date() },
          where: { id },
        });

        const user = await ctx.prisma.user.findFirstOrThrow({
          where: { email },
        });

        const secret = new TextEncoder().encode(ENV.NEXTAUTH_SECRET);

        const jwt = await new SignJWT({ id: user.id })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(ENV.JWT_EXPIRE_PERIOD)
          .sign(secret);

        return {
          jwt,
          user,
        };
      }),
  }),
});

export default auth_api_router;
export type AuthApiRouter = typeof auth_api_router;
