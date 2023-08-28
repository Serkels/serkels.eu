/**
 * Messages controller
 */

import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import type { StrapiRequestContext } from "strapi-typed";

export default {
  async count(ctx: StrapiRequestContext<never, never, { id: string }>) {
    const { params } = ctx;
    const { id } = params;
    const where = { related: `api::exchange-deal.exchange-deal:${id}` };

    return await strapi.db
      .query(strapi.plugin("comments").contentTypes["comment"]?.uid as string)
      .count({
        where,
      });
  },

  async find(ctx: Context, next: Next) {
    return strapi.controller("plugin::comments.client").findAllFlat(ctx, next);
  },
  async findOne(ctx: Context, next: Next) {
    return strapi.controller("plugin::comments.admin").findOne(ctx, next);
  },
  async create(ctx: Context, next: Next) {
    return strapi.controller("plugin::comments.client").post(ctx, next);
  },
  async delete(ctx: Context, next: Next) {
    return strapi.controller("plugin::comments.admin").deleteComment(ctx, next);
  },
};
