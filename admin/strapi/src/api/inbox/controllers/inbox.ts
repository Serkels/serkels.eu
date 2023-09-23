/**
 * inbox controller
 */

import { ID_Schema } from "@1/core/domain";
import { factories } from "@strapi/strapi";
import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { sanitize, validate } from "@strapi/utils";
import type { Next } from "koa";
import { Common_Service } from "~/src/extensions/comments/services";
import { replace_autor } from "~/src/extensions/comments/services/replace_autor";
import { GetValues, KoaContext, Params } from "~/types";
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

  //

  async findOne(ctx: KoaContext, next: Next) {
    const contentType = strapi.contentType(INBOX_API_CONTENT_ID);

    const user_id = ID_Schema.parse(ctx.state.user.id, {
      path: ["context.state.user.id"],
    });
    const inbox_id = ID_Schema.parse(ctx.params.id, {
      path: ["ctx.params.id"],
    });

    await validate.contentAPI.query(ctx.query, contentType as any, {
      auth: ctx.state.auth,
    });

    const sanitizedQueryParams = await sanitize.contentAPI.query(
      ctx.query,
      contentType,
      { auth: ctx.state.auth },
    );

    const query = {
      populate: {
        ...((sanitizedQueryParams.populate as any) || {}),
        participant: true,
        thread: { populate: { last_message: true, participants: true } },
      },
      filters: {
        ...((sanitizedQueryParams.filters as any) || {}),
        owner: { id: user_id },
      },
    } satisfies Params.Pick<
      typeof INBOX_API_CONTENT_ID,
      "filters" | "populate"
    >;

    const result = (await strapi
      .service(INBOX_API_CONTENT_ID)
      .findOne(inbox_id, { ...sanitizedQueryParams, ...query })) as GetValues<
      typeof INBOX_API_CONTENT_ID
    >;

    const sanitizedResults = (await sanitize.contentAPI.output(
      result,
      contentType,
      {
        auth: ctx.state.auth,
      },
    )) as GetValues<typeof INBOX_API_CONTENT_ID>;

    const last_message = await replace_autor(
      await Common_Service.findOne({
        id: result.thread.last_message.id,
      }),
    );

    return transformResponse(
      {
        ...sanitizedResults,
        thread: { ...sanitizedResults.thread, last_message },
      },
      {},
      { contentType },
    );
  },
});
