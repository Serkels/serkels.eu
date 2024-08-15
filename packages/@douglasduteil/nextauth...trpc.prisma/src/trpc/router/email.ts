//

//

import { SEND_VERIFICATION_REQUEST_INPUT_SCHEMA } from "../../config";
import { verify_next_auth_token } from "../guards";
import { procedure, router } from "../trpc";

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

export function create_EmailProvider_router<Context>({
  resolver,
}: {
  resolver: SendEmailResolverFn<Context>;
}) {
  const next_auth_procedure = procedure.use(verify_next_auth_token());

  return router({
    sendVerificationRequest: next_auth_procedure
      .input(SEND_VERIFICATION_REQUEST_INPUT_SCHEMA)
      .mutation(resolver as any),
  });
}
export default create_EmailProvider_router;
