/**
 * Messages controller
 */

import { ID_Schema } from "@1/core/domain";
import type { Common } from "@strapi/strapi";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import { Comment, type KoaContext } from "~/types";

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
  async create(context: KoaContext, next: Next) {
    const response = (await strapi
      .controller("plugin::comments.client" as Common.UID.Controller)
      .post(context, next)) as Comment;

    //
    //
    //

    const id = ID_Schema.parse(
      String(response.related).replace(`api::thread.thread:`, ""),
      { path: ["response.related"] },
    );

    await strapi.entityService.update("api::thread.thread", id, {
      data: {
        last_message: Number(response.id),
      },
    });

    strapi.log.info(
      `controller api::inbox.messages.create > ` +
        `UPDATE "api::thread.thread" ${id} ` +
        `{last_message: ${response.id}}`,
    );

    return response;
  },
  async delete(ctx: Context, next: Next) {
    return strapi
      .controller("plugin::comments.admin" as Common.UID.Controller)
      .deleteComment(ctx, next);
  },
};
