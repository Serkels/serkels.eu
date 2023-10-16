//

import { decode } from "@auth/core/jwt";
import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";

//


export function verify_next_auth_token(secret: string) {
  return middleware(async ({ ctx, next }) => {
    console.log(">>>>>>>>>>>>>>>>", {
      token: ctx.headers.NEXTAUTH_TOKEN,
      secret,
    });
    const payload = await decode({ token: ctx.headers.NEXTAUTH_TOKEN, secret });
    if (payload) {
      return next();
    }
    throw new TRPCError({ code: "UNAUTHORIZED" });
  });
}
