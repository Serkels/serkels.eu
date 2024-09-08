//

import { TRPCError } from "@trpc/server";
import { decode } from "../jwt";
import { middleware } from "./trpc";
import { NEXTAUTH_TRPCENV } from "../config";

//

export function verify_next_auth_token<T>() {
  return middleware(async function guard_middleware({ ctx, next }) {
    const { AUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);
    try {
      const payload = (await decode({
        token: ctx.headers.NEXTAUTH_TOKEN,
        salt: "",
        secret,
      })) as T;

      if (payload) {
        return next({ ctx: { ...ctx, payload } });
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
        cause: new Error("No payload"),
      });
    } catch (cause) {
      throw new TRPCError({ code: "PARSE_ERROR", cause });
    }
  });
}
