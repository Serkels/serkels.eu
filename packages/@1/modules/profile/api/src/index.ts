//

import { procedure, router, type Context } from "@1.module/trpc";
import { type SendEmailResolverFn } from "@douglasduteil/nextauth...trpc.prisma/trpc/router/email";
import { ProfileRole } from "@prisma/client";
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

const PROFILE_ROLES = z.union([
  z.literal("admin"),
  z.literal("partner"),
  z.literal("studient"),
]);

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
  create: procedure
    .input(z.object({ role: PROFILE_ROLES }))
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

      await ctx.prisma.profile.create({
        data: {
          ...input,
          role: ProfileRole[
            input.role.toUpperCase() as Uppercase<typeof input.role>
          ],
        },
      });

      return { sent: true, email: email };
    }),
});
