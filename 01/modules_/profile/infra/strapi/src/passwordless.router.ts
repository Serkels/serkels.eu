//

import type { OpenAPI_Repository } from "@1/core_";
import type { ApiClient } from "@1/strapi-openapi";
import { initTRPC, TRPCError } from "@trpc/server";
import debug from "debug";
import { z } from "zod";

//

const log = debug("~:infra/strapi/src/passwordless.router.ts");

//

const t = initTRPC
  .context<{ openapi: OpenAPI_Repository<ApiClient> }>()
  .create();
export const router = t.router;
export const procedure = t.procedure;
export const passwordlessRouter = router({
  login: procedure
    .input(
      z.object({
        token: z.string().nonempty(),
      }),
    )
    .mutation(async (opts) => {
      const trace = log.extend("<login>");

      trace("", opts);
      const { openapi } = opts.ctx;
      const { token: loginToken } = opts.input;
      const {
        data,
        error: errorBody,
        response,
      } = await openapi.client.GET("/passwordless/login", {
        params: { query: { loginToken } },
      });

      trace(response.status);
      if (errorBody) {
        trace("ERROR", errorBody);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: [errorBody.error.message, "from " + response.url].join("\n"),
          cause: errorBody.error,
        });
      }

      return data;
    }),

  //

  send_magic_link: procedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      const trace = log.extend("<send_magic_link>");

      trace("", opts);
      const { openapi } = opts.ctx;
      const {
        data,
        error: errorBody,
        response,
      } = await openapi.client.POST("/passwordless/send-link", {
        body: { email: opts.input.email },
      });

      trace(response.status);
      if (errorBody) {
        trace("ERROR", errorBody);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: [errorBody.error.message, "from " + response.url].join("\n"),
          // optional: pass the original error to retain stack trace
          cause: errorBody.error,
        });
      }

      return data;
    }),
});

export type PasswordlessRouter = typeof passwordlessRouter;
