//

import { TRPCError } from "@trpc/server";
import { NEXTAUTH_TRPCENV } from "../config";
import { decode } from "../jwt";
import { middleware } from "./trpc";

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

export function VerifyNextAuthTokenUseCase<T>(token: string) {
  return async function verify_next_auth_token_exec() {
    const { NEXTAUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);

    const payload = (await decode({
      token,
      secret,
    })) as T;

    if (!payload) {
      throw new Error("No payload");
    }

    return payload;
  };
}
