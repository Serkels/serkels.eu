//

import { Next } from "koa";
import { StrapiRequestContext } from "strapi-typed";

export async function filter_owner(ctx, next: Next) {
  const strapi_ctx: StrapiRequestContext = ctx;
  const owner = strapi_ctx.state.user?.id;

  strapi_ctx.query.filters = {
    ...(ctx.query.filters || {}),
    owner: owner,
  };

  return next();
}

export default filter_owner;
