/**
 * exchange-deal controller
 */

import { factories } from "@strapi/strapi";
import { transformResponse } from "@strapi/strapi/lib/core-api/controller/transform";
import { sanitize, validate } from "@strapi/utils";
import type { Next } from "koa";
import { Common_Service } from "~/src/extensions/comments/services";
import { replace_autor } from "~/src/extensions/comments/services/replace_autor";
import { GetValues, ID_Schema, Params, type KoaContext } from "~/types";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";

export default factories.createCoreController(
  "api::exchange-deal.exchange-deal",
  {
    async find(ctx: KoaContext, next: Next) {
      type Entity = GetValues<"api::exchange-deal.exchange-deal">;
      const { apiName } = ctx.state.route.info;
      const uuid = `api::${apiName}.${apiName}`;
      const sanitizedQuery = await this.sanitizeQuery(ctx);
      const { results, pagination } = await strapi
        .service(uuid)
        .find(sanitizedQuery);
      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      // ! HACK(douglasduteil): retrive the comment relation by hand
      // As I don't know how to allow the content type to access it
      const sanitizedResultsWithLastMessage = sanitizedResults.map(
        (result: Entity, index) =>
          ({
            ...result,
            last_message: results[index]["last_message"],
          }) as Entity,
      );

      return this.transformResponse(sanitizedResultsWithLastMessage, {
        pagination,
      });
    },

    //

    async findOne(ctx: KoaContext, next: Next) {
      const contentType = strapi.contentType(EXCHANGE_DEAL_API_CONTENT_ID);

      const user_id = ID_Schema.parse(ctx.state.user.id, {
        path: ["context.state.user.id"],
      });
      const deal_id = ID_Schema.parse(ctx.params.id, {
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
          last_message: true,
        },
        filters: {
          ...((sanitizedQueryParams.filters as any) || {}),
          owner: { id: user_id },
        },
      } satisfies Params.Pick<
        typeof EXCHANGE_DEAL_API_CONTENT_ID,
        "filters" | "populate"
      >;

      const result = await strapi
        .service(EXCHANGE_DEAL_API_CONTENT_ID)
        .findOne(deal_id, { ...sanitizedQueryParams, ...query });

      const sanitizedResults = (await sanitize.contentAPI.output(
        result,
        contentType,
        {
          auth: ctx.state.auth,
        },
      )) as GetValues<typeof EXCHANGE_DEAL_API_CONTENT_ID>;

      const last_message = await replace_autor(
        await Common_Service.findOne({
          id: result.last_message.id,
        }),
      );

      return transformResponse(
        { ...sanitizedResults, last_message },
        {},
        { contentType },
      );
    },

    //
  },
);
