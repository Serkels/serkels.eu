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
    return strapi.controller("plugin::comments.client").findAllFlat(ctx, next);
  },
  async findOne(ctx: ExtendableContext, next: Next) {
    return strapi.controller("plugin::comments.admin").findOne(ctx, next);
  },
  async post(ctx: StrapiRequestContext, next: Next) {
    return strapi.controller("plugin::comments.client").post(ctx as any, next);
  },
  async delete(ctx: StrapiRequestContext, next: Next) {
    return strapi
      .controller("plugin::comments.admin")
      .deleteComment(ctx as any, next);
  },
};
