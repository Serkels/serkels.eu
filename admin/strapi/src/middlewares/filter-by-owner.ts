//

import type { Strapi } from "@strapi/strapi";
import type { Next } from "koa";
import type { StrapiContext } from "~/types";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (context: StrapiContext, next: Next) => {
    const owner = context.state.user?.id;

    if (!owner) {
      strapi.log.warn(
        `global::filter-by-owner policy detected no user. It can only work with 'Authenticated' requests.`,
      );

      return;
    }

    context.query.filters = {
      ...(context.query.filters || {}),
      owner: owner,
    };

    await next();
  };
};
