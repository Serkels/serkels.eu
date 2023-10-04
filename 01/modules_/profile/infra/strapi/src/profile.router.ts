//

import type { OpenAPI_Repository } from "@1/core_";
import type { ApiClient } from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";

//

const t = initTRPC
  .context<{ openapi: OpenAPI_Repository<ApiClient>; headers: Headers }>()
  .create();
export const router = t.router;
export const procedure = t.procedure;
export const profileRouter = router({
  me: procedure.query(({ ctx: { headers, openapi } }) => {
    const {
      client: { GET },
    } = openapi;
    return openapi.fetch(
      GET("/user-profiles/me", {
        headers,
      }),
    );
  }),
});

export type ProfileRouter = typeof profileRouter;
