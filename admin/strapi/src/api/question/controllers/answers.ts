/**
 * question controller
 */

import { ExtendableContext, Next } from "koa";
import { StrapiRequestContext } from "strapi-typed";

export default {
  async count(ctx: StrapiRequestContext<never, never, { id: string }>) {
    const { params } = ctx;
    const { id } = params;
    const where = { related: `api::question.question:${id}` };

    return await strapi.db
      .query(strapi.plugin("comments").contentTypes["comment"]?.uid as string)
      .count({
        where,
      });
  },

  async find(ctx: ExtendableContext, next: Next) {
    console.log(strapi.controller("plugin::comments.client"));
    return strapi.controller("plugin::comments.client").findAllFlat(ctx, next);
  },
};
