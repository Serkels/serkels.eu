//

import type { Next } from "koa";
import type { StrapiContext } from "../types";

//

export default () => {
  return async (ctx: StrapiContext, next: Next) => {
    const user = ctx.state.user;
    const data = ctx.body?.data;
    console.log(__filename, { data });
    if (!data) {
      return next();
    }
    data.owner = user.id;
    console.log(__filename, { data });

    await next();
  };
};
