//

import type { Next, ParameterizedContext } from "koa";
import type { ResponseBody, State } from "../../../types";

export default () => {
  return async function relation(ctx: Context, next: Next) {
    const { params } = ctx;
    ctx.params = { relation: `api::question.question:${params.id}` };
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
