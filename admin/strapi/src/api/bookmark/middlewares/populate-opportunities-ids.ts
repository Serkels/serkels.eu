//

import type { Next } from "koa";
import { StrapiContext } from "~/types";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    context.query.populate = {
      ...(context.query.populate || {}),
      opportunity: { fields: ["id"] },
    };

    await next();
  };
};
