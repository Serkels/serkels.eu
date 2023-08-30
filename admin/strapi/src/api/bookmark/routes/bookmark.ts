/**
 * bookmark router
 */

import { factories, type Shared } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import { StrapiRequestContext } from "strapi-typed";
import { ApiBookmarkBookmark } from "~/types/generated/contentTypes";
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

          const entityService: EntityService = strapi.entityService;
          const entry = await entityService.count<
            keyof Shared.ContentTypes,
            ApiBookmarkBookmark["attributes"]
          >("api::bookmark.bookmark", {
            filters: { owner, opportunity: data.opportunity },
          });

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
