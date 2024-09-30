//

import type { AuthProfile } from "@1.modules/profile.domain";
import { VerifyNextAuthTokenUseCase } from "@douglasduteil/nextauth...trpc.prisma/usecase/VerifyNextAuthTokenUseCase";
import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "./trpc";

//

export function verify_next_auth_token<TPayload>(passthrough = false) {
  return middleware(async function guard_middleware({ ctx, next }) {
    try {
      const verify = VerifyNextAuthTokenUseCase<TPayload>(
        ctx.headers.NEXTAUTH_TOKEN,
      );
      const payload = await verify();
      return next({ ctx: { ...ctx, payload } });
    } catch (cause) {
      if (passthrough) return next({ ctx: { ...ctx, payload: {} } });
      throw new TRPCError({ code: "PARSE_ERROR", cause });
    }
  });
}

export const next_auth_procedure = procedure
  .use(verify_next_auth_token<{ profile: AuthProfile }>())
  .use(async ({ ctx: { payload }, next }) => {
    if (!payload.profile) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        cause: new Error("No profile"),
      });
    }
    return next();
  });

export const maybe_next_auth_procedure = procedure.use(
  verify_next_auth_token<{ profile?: AuthProfile }>(true),
);
