//

import { procedure, router, type Context } from "@1.module/trpc";
import { TocTocMagicLinkEmail } from "@1.modules/auth.emails";
import create_NextAuth_router from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
import create_EmailProvider_router, {
  type SendEmailResolverFn,
} from "@douglasduteil/nextauth...trpc.prisma/trpc/router/email";
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

export default router({
  next_auth_adapter: create_NextAuth_router(ENV.NEXTAUTH_SECRET),
  next_auth_provider: create_EmailProvider_router(ENV.NEXTAUTH_SECRET, {
    resolver: send_email_resolver,
  }),
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
