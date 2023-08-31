/**
 * Messages controller
 */

import type { Common } from "@strapi/strapi";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";

export default {
  async find(ctx: Context, next: Next) {
    return strapi
      .controller("plugin::comments.client" as Common.UID.Controller)
      .findAllFlat(ctx, next);
  },
  async findOne(ctx: Context, next: Next) {
    return strapi
      .controller("plugin::comments.admin" as Common.UID.Controller)
      .findOne(ctx, next);
  },
  async create(ctx: Context, next: Next) {
    return strapi
      .controller("plugin::comments.client" as Common.UID.Controller)
      .post(ctx, next);
  },
  async delete(ctx: Context, next: Next) {
    return strapi
      .controller("plugin::comments.admin" as Common.UID.Controller)
      .deleteComment(ctx, next);
  },
};
