//

import type { OpenAPI_Repository } from "@1/core_";
import type { ApiClient } from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";

//

const t = initTRPC
  .context<{ openapi: OpenAPI_Repository<ApiClient>; headers: Headers }>()
  .create();

export const notification_router = t.router({
  me: t.procedure.query(async ({ ctx: { headers, openapi } }) => {
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

export type NotificationRouter = typeof notification_router;
