/**
 * inbox controller
 */

import { factories } from "@strapi/strapi";
import type { Next } from "koa";
import { GetValues, KoaContext } from "~/types";

//;

export default factories.createCoreController("api::inbox.inbox", {
  async find(ctx: KoaContext, next: Next) {
    type Entity = GetValues<"api::inbox.inbox">;
    const { apiName } = ctx.state.route.info;
    const uuid = `api::${apiName}.${apiName}` as const;
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
          thread: results[index]["thread"],
        }) as Entity,
    );
    return this.transformResponse(sanitizedResultsWithLastMessage, {
      pagination,
    });
  },
});
