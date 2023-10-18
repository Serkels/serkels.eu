//

import { TRPCError } from "@trpc/server";
import { decode } from "../jwt";
import { middleware } from "./trpc";

//

export function verify_next_auth_token(secret: string) {
  return middleware(async ({ ctx, next }) => {
    try {
      const payload = await decode({
        token: ctx.headers.NEXTAUTH_TOKEN,
        secret,
      });

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
