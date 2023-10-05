//

import type { TRPCOpenAPIContext } from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";

//

const { router, procedure } = initTRPC.context<TRPCOpenAPIContext>().create();

//
export type ProfileRouter = typeof profileRouter;
export const profileRouter = router({
  me: procedure.query(async ({ ctx: { headers, openapi } }) => {
    const {
      client: { GET },
    } = openapi;
    const data = await openapi.fetch(
      GET("/user-profiles/me", {
        headers,
      }),
    );
    return data;
  }),
});
