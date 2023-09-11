/**
 * inbox controller
 */

import { factories } from "@strapi/strapi";
import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { sanitize, validate } from "@strapi/utils";
import type { Next } from "koa";
import { ID_Schema, KoaContext, Params } from "~/types";
import { INBOX_API_CONTENT_ID } from "../content-types/inbox";
import { find_owner_inboxes } from "../services/inbox";

//;

export default factories.createCoreController("api::inbox.inbox", {
  async find(ctx: KoaContext, next: Next) {
    const contentType = strapi.contentType(INBOX_API_CONTENT_ID);

    await validate.contentAPI.query(ctx.query, contentType as any, {
      auth: ctx.state.auth,
    });

    const owner = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });

    //

    try {
      const inboxes = await find_owner_inboxes(owner, ctx);

      const sanitizedQueryParams = await sanitize.contentAPI.query(
        ctx.query,
        contentType,
        { auth: ctx.state.auth },
      );
      const { results, pagination } = await strapi
        .service(INBOX_API_CONTENT_ID)
        .find({
          ...sanitizedQueryParams,
          filters: {
            id: { $in: inboxes.map(({ id }) => id) },
          },
        } satisfies Params.Pick<typeof INBOX_API_CONTENT_ID, "filters">);

      return transformResponse(results, { pagination }, { contentType });
    } catch (error) {
      const pagination = {
        page: 1,
        pageCount: 25,
        pageSize: 0,
        total: 0,
      };
      const data = [];
      return transformResponse(data, { pagination }, { contentType });
    }
  },
});
