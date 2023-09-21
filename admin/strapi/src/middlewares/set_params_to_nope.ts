//

import type { Next } from "koa";
import type { KoaContext } from "~/types";

//

export function set_params_to_nope() {
  return function set_params_to_nope(ctx: KoaContext, next: Next) {
    ctx.params = {};

    //
    //
    //

    return next();
  };
}
