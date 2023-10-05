//

import type { TRPCOpenAPIContext } from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

//

const { router, procedure } = initTRPC.context<TRPCOpenAPIContext>().create();

//

export const passwordlessRouter = router({
  login: procedure
    .input(
      z.object({
        token: z.string().nonempty(),
      }),
    )
    .mutation(async ({ ctx: { openapi }, input: { token } }) => {
      const {
        client: { GET },
      } = openapi;
      const data = await openapi.fetch(
        GET("/passwordless/login", {
          params: { query: { loginToken: token } },
        }),
      );

      return z
        .object({
          jwt: z.string(),
          user: z.object({
            id: z.coerce.number().transform(String),
          }),
          context: z.any(),
        })
        .parse(data, { path: ["<send_magic_link>.data"] });
    }),

  //

  send_magic_link: procedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(({ ctx: { openapi }, input: { email } }) => {
      const {
        client: { POST },
      } = openapi;
      return openapi.fetch(
        POST("/passwordless/send-link", {
          body: { email },
        }),
      );
    }),
});

export type PasswordlessRouter = typeof passwordlessRouter;
