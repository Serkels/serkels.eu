/**
 * bookmark router
 */

import { factories } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import { StrapiRequestContext } from "strapi-typed";
import { z } from "zod";
export default factories.createCoreRouter("api::bookmark.bookmark", {
  only: ["find", "create", "delete"],
  config: {
    create: {
      middlewares: [
        "global::assign-owner",
        async function no_duplicate_entry(ctx, next: Next) {
          const strapi_state_ctx: StrapiRequestContext = ctx;
          const strapi_ctx: Context & {
            request: {
              body: {
                data: GetValues<"api::bookmark.bookmark">;
              };
            };
          } = ctx;
          const owner = strapi_state_ctx.state.user?.id;
          const data = strapi_ctx.request.body.data;
          const opportunity = z.coerce.number().safeParse(data.opportunity);
          if (!opportunity.success) {
            return strapi_ctx.throw(400, "Invalid opportunity id");
          }
          const entityService: EntityService = strapi.entityService;
          const entry = await entityService.count("api::bookmark.bookmark", {
            filters: { owner, opportunity: { id: opportunity.data } },
          });

          if (1) {
            return strapi_ctx.throw(409, "Already bookmarked");
          }
          if (entry > 0) {
            return strapi_ctx.throw(409, "Already bookmarked");
          }

          return next();
        },
        "api::bookmark.populate-opportunities-ids",
      ],
    },
    delete: {
      policies: ["global::is-owned"],
    },
    find: {
      middlewares: [
        "global::filter-by-owner",
        "api::bookmark.populate-opportunities-ids",
      ],
      policies: [],
    },
  },
});
