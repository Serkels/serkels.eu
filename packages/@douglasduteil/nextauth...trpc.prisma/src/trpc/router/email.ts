//

//

import { TRPCError } from "@trpc/server";
import { SEND_VERIFICATION_REQUEST_INPUT_SCHEMA } from "../../config";
import { middleware, procedure, router } from "../trpc";

//

//
// Inspired by https://github.com/nextauthjs/next-auth/tree/main/packages/core/src/providers/email.ts
// \from https://github.com/nextauthjs/next-auth/blob/c4ad77b86762b7fd2e6362d8bf26c5953846774a/packages/core/src/providers/email.ts
//

export type NextAuth_Router = ReturnType<typeof create_EmailProvider_router>;
export type SendEmailResolverFn<Context> = (opts: {
  input: SEND_VERIFICATION_REQUEST_INPUT_SCHEMA;
  ctx: Context;
}) => Promise<void>;
//

export function create_EmailProvider_router<Context>(
  secret: string,
  {
    resolver,
  }: {
    resolver: SendEmailResolverFn<Context>;
  },
) {
  // TODO(douglasduteil) : share the middleware
  const is_next_auth = middleware(async ({ ctx, next }) => {
    if (ctx.headers.NEXTAUTH_TOKEN === secret) {
      return next();
    }
    throw new TRPCError({ code: "UNAUTHORIZED" });
  });

  const next_auth_procedure = procedure.use(is_next_auth);

  return router({
    sendVerificationRequest: next_auth_procedure
      .input(SEND_VERIFICATION_REQUEST_INPUT_SCHEMA)
      .mutation(resolver as any),
  });
}
export default create_EmailProvider_router;
//
