/**
 * `populate-all` middleware
 */

import { Common, Strapi } from "@strapi/strapi";
import { sanitize } from "@strapi/utils";
import { KoaContext, Next, Params } from "~/types";

export default (
  config: Params.Pick<Common.UID.Schema, "populate">,
  { strapi }: { strapi: Strapi },
) => {
  // Add your own logic here.
  return async (ctx: KoaContext, next: Next) => {
    const apiName = ctx.state.route.info.apiName;
    const contentType = strapi.contentType(`api::${apiName}.${apiName}`);

    const [sanitizeQueryPopulate, populate_all, config_populate] =
      await Promise.all([
        sanitize.contentAPI.populate(ctx.query.populate ?? {}, contentType, {
          auth: ctx.state.auth,
        }) as Promise<object>,
        sanitize.contentAPI.populate("*", contentType, {
          auth: ctx.state.auth,
        }) as Promise<object>,
        sanitize.contentAPI.populate(config.populate ?? {}, contentType, {
          auth: ctx.state.auth,
        }) as Promise<object>,
      ]);

    ctx.query.populate = {
      ...populate_all,
      ...sanitizeQueryPopulate,
      ...config_populate,
    };

    //
    //
    //

    await next();
  };
};
