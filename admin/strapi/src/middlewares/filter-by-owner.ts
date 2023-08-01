//

import type { Strapi } from "@strapi/strapi";
import type { Next } from "koa";
import type { StrapiContext } from "../types";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (context: StrapiContext, next: Next) => {
    console.log(">>> strapi/src/middlewares/filter-by-owner.ts");
    console.log("context.state=", { state: context.state });
    console.log("context.query=", { query: context.query });
    console.log("context.params=", { params: context.params });

    const owner = context.state.user?.id;

    console.log("owner=", { owner });

    if (!owner) {
      strapi.log.warn(
        `global::filter-by-owner policy detected no user. It can only work with 'Authenticated' requests.`,
      );

      return;
    }

    // const bookmarks: {id: number}[] = await strapi.entityService.findMany(
    //   "api::bookmark.bookmark",
    //   {
    //     populate: "*",
    //   },
    //   { filters: { owner: userId } },
    // );
    // console.log(">>> strapi/src/middlewares/filter-by-owner.ts");
    // console.log("bookmarks=", { bookmarks });

    // const user_bookmarks = bookmarks[0];

    context.query.filters = {
      ...(context.query.filters || {}),
      owner: owner,
    };

    await next();
  };
};
