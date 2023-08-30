/**
 * exchange-deal controller
 */

import { factories } from "@strapi/strapi";
import type { Next } from "koa";
import { GetValues, KoaContext } from "~/types";

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
  },
);
