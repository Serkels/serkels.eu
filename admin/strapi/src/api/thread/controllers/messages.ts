/**
 * Messages controller
 */

import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";

export default {
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
