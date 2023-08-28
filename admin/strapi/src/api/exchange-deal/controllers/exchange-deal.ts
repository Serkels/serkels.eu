/**
 * exchange-deal controller
 */

import { factories } from "@strapi/strapi";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import { ApiExchangeDealExchangeDeal } from "~/types/generated/contentTypes";

export default factories.createCoreController(
  "api::exchange-deal.exchange-deal",
  {
    async find(ctx: Context, next: Next) {
      // super.find(ctx, next); like

      const sanitizedQuery = await this.sanitizeQuery(ctx);
      const { results, pagination } = await strapi
        .service("api::exchange-deal.exchange-deal")
        .find(sanitizedQuery);
      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      // ! HACK(douglasduteil): retrive the comment relation by hand
      // As I don't know how to allow the content type to access it
      const sanitizedResultsWithLastMessage = sanitizedResults.map(
        (result: ApiExchangeDealExchangeDeal["attributes"], index) =>
          ({
            ...result,
            last_message: results[index]["last_message"],
          }) as ApiExchangeDealExchangeDeal["attributes"],
      );

      return this.transformResponse(sanitizedResultsWithLastMessage, {
        pagination,
      });
    },
  },
);
