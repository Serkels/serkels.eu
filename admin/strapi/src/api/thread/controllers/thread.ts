/**
 * thread controller
 */

import { factories } from "@strapi/strapi";
import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { sanitize, validate } from "@strapi/utils";
import type { Next } from "koa";
import { Common_Service } from "~/src/extensions/comments/services";
import { replace_autor } from "~/src/extensions/comments/services/replace_autor";
import { GetValues, ID_Schema, KoaContext, Params } from "~/types";
import { THREAD_API_CONTENT_ID } from "../content-types/thread";

export default factories.createCoreController("api::thread.thread", {
  async findOne(ctx: KoaContext, next: Next) {
    const contentType = strapi.contentType(THREAD_API_CONTENT_ID);

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
      typeof THREAD_API_CONTENT_ID,
      "filters" | "populate"
    >;

    const result = (await strapi
      .service(THREAD_API_CONTENT_ID)
      .findOne(inbox_id, { ...sanitizedQueryParams, ...query })) as GetValues<
      typeof THREAD_API_CONTENT_ID
    >;

    const sanitizedResults = (await sanitize.contentAPI.output(
      result,
      contentType,
      {
        auth: ctx.state.auth,
      },
    )) as GetValues<typeof THREAD_API_CONTENT_ID>;

    const last_message = await replace_autor(
      await Common_Service.findOne({
        id: result.last_message.id,
      }),
    );

    return transformResponse(
      {
        ...sanitizedResults,
        last_message,
      },
      {},
      { contentType },
    );
  },
});
