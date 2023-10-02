//

import type { OpenapiTrpc } from "@1/core_";
import type { ApiClient } from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, injectable, scoped } from "tsyringe";

//

@scoped(Lifecycle.ContainerScoped)
@injectable()
export class Passwordless_Router {
  #log = debug(`~:modules:partner:Partner_Repository`);
  constructor(private readonly trpc: OpenapiTrpc<ApiClient>) {
    this.#log("new");
  }

  // router = this.t
  // router = this.trpc.router({
  //   send_magic_link: this.
  //     .input(
  //       z.object({
  //         email: z.string().email(),
  //       }),
  //     )
  //     .query(async (opts) => {
  //       console.log({ opts });
  //       const { openapi } = opts.ctx;
  //       const { response } = await openapi.client.POST(
  //         "/passwordless/send-link",
  //         {
  //           body: { email: opts.input.email },
  //         },
  //       );
  //       return response;
  //     }),
}
/*
const t = initTRPC
  .context<{ openapi: OpenAPI_Repository<ApiClient> }>()
  .create();
export const router = t.router;
export const procedure = t.procedure;
export const passwordlessRouter = router({
  send_magic_link: procedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async (opts) => {
      console.log({ opts });
      const { openapi } = opts.ctx;
      const { response } = await openapi.client.POST(
        "/passwordless/send-link",
        {
          body: { email: opts.input.email },
        },
      );
      return response;
    }),
});

export type PasswordlessRouter = typeof passwordlessRouter;
*/
