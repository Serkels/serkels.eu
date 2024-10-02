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

export function set_next_auth_session() {
  return middleware(async function guard_session_middleware({ ctx, next }) {
    const { auth } = ctx;
    try {
      const session = await auth();
      return next({
        ctx: {
          ...ctx,
          session,
        },
      });
    } catch (cause) {
      throw new TRPCError({ code: "UNAUTHORIZED", cause });
    }
  });
}

export const maybe_session_procedure = procedure.use(set_next_auth_session());

export const session_procedure = maybe_session_procedure.use(
  async ({ ctx, next }) => {
    const { session } = ctx;
    if (!session?.profile) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        cause: new Error("No profile"),
      });
    }
    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  },
);
