/**
 * bookmark router
 */

import type { EntityService, StrapiContext } from "@/src/types";
import { ApiBookmarkBookmark } from "@/types/generated/contentTypes";
import { factories, type Shared } from "@strapi/strapi";
import type { Next } from "koa";
export default factories.createCoreRouter("api::bookmark.bookmark", {
  only: ["find", "create", "delete"],
  config: {
    create: {
      middlewares: [
        "global::assign-owner",
        async function no_duplicate_entry(ctx: StrapiContext, next: Next) {
          const owner = ctx.state.user?.id;
          const data = ctx.request["body"]
            ?.data as ApiBookmarkBookmark["attributes"];

          const entityService: EntityService = strapi.entityService;
          const entry = await entityService.count<
            keyof Shared.ContentTypes,
            ApiBookmarkBookmark["attributes"]
          >("api::bookmark.bookmark", {
            filters: { owner, opportunity: data.opportunity },
          });

          if (entry > 0) {
            return ctx.throw(409, "Already bookmarked");
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
        async function filter_owner(ctx: StrapiContext, next: Next) {
          const owner = ctx.state.user?.id;

          ctx.query.filters = {
            ...(ctx.query.filters || {}),
            owner: owner,
          };

          return next();
        },
        "api::bookmark.populate-opportunities-ids",
      ],
      policies: [],
    },
  },
});
