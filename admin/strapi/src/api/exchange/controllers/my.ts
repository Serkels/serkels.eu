/**
 * question controller
 */

import { Context } from "@strapi/utils/dist/types";
import { Next } from "koa";

export default {
  async find(ctx: Context, next: Next) {
    return strapi.controller("plugin::comments.client").findAllFlat(ctx, next);
  },
};
