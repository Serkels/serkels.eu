//

import type { Next, ParameterizedContext } from "koa";
import type { ResponseBody, State } from "../../../../types";

export default () => {
  return async function relation(ctx: Context, next: Next) {
    const { params } = ctx;
    ctx.params = {
      ...(ctx.params ?? {}),
      relation: `api::exchange-deal.exchange-deal:${params.id}`,
    };
    return next();
  };
};

type Context = ParameterizedContext<
  State,
  {
    params?: {
      id?: string;
      relation?: string;
    };
  },
  ResponseBody
>;
