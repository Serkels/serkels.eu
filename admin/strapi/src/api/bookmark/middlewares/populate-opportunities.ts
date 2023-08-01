//

import type { Strapi } from "@strapi/strapi";
import type { Next } from "koa";
import type { StrapiContext } from "../../../types";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (context: StrapiContext, next: Next) => {
    console.log(">>> strapi/src/middlewares/set-owner.ts");
    console.log("context.state=", { state: context.state });
    console.log("context.query=", { query: context.query });
    console.log("context.params=", { params: context.params });

    context.query.populate = {
      ...(context.query.populate || {}),
      opportunities: "*",
    };

    await next();
  };
};
