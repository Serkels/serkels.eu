/**
 * bookmark router
 */

import type { EntityService, StrapiContext } from "@/src/types";
import { ApiBookmarkBookmark } from "@/types/generated/contentTypes";
import { factories, type Shared } from "@strapi/strapi";
import { Router } from "@strapi/strapi/lib/types/core-api/router";
import type { Next } from "koa";

const coreRouter = factories.createCoreRouter("api::bookmark.bookmark", {
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
}) as unknown as Router;
export default coreRouter;
export const sdf = {
  get prefix() {
    return coreRouter.prefix;
  },
  get routes() {
    return [
      {
        method: "GET",
        path: "/bookmarks",
        handler: "api::bookmark.bookmark.findOne",
        config: {
          description: "Get authenticated user bookmarks",
          middlewares: [
            async function findBookmarkId(ctx: StrapiContext, next: Next) {
              const entityService: EntityService = strapi.entityService;
              const owner = ctx.state.user?.id;
              const bookmarks = await entityService.findMany<
                keyof Shared.ContentTypes,
                ApiBookmarkBookmark["attributes"] & { id: number }
              >("api::bookmark.bookmark", {
                filters: {
                  owner,
                },
              });
              // const bookmarks = await entityService.findMany(
              //   "api::bookmark.bookmark",
              //   {},
              //   { filters: { owner } },
              // );

              const id = String(bookmarks[0].id);

              //

              ctx.params = { id };
              return next();
            },
            "api::bookmark.populate-opportunities-ids",
          ],
          auth: { scope: ["api::bookmark.bookmark.findOne"] },
          policies: ["global::is-authenticated"],
        },
        info: { apiName: "bookmark", type: "content-api" },
      },
      {
        method: "PUT",
        path: "/bookmarks/:id",
        handler: "api::bookmark.bookmark.update",
        config: {
          auth: { scope: ["api::bookmark.bookmark.update"] },
          policies: [
            "global::is-authenticated",
            async (policyContext, config, { strapi }) => {
              console.log(">>> strapi/src/api/bookmark/routes/bookmark.ts");
              const bookmark = await strapi.entityService.findOne(
                "api::bookmark.bookmark",
                policyContext.params.id,
                {
                  populate: { owner: true },
                },
              );

              if (!bookmark) {
                return false;
              }
              console.log("bookmark.owner.id", bookmark.owner.id);
              console.log(
                "policyContext.state.user.id",
                policyContext.state.user.id,
              );
              if (bookmark.owner.id === policyContext.state.user.id) {
                return true;
              }

              return false;
            },
          ],
        },
        info: { apiName: "bookmark", type: "content-api" },
      },
      // {
      //   method: "GET",
      //   path: "/bookmarks/:id",
      //   handler: "api::bookmark.bookmark.findOne",
      //   config: {},
      // },
      // {
      //   method: "POST",
      //   path: "/bookmarks",
      //   handler: "api::bookmark.bookmark.create",
      //   config: {},
      // },
      // {
      //   method: "PUT",
      //   path: "/bookmarks/:id",
      //   handler: "api::bookmark.bookmark.update",
      //   config: {},
      // },
      // {
      //   method: "DELETE",
      //   path: "/bookmarks/:id",
      //   handler: "api::bookmark.bookmark.delete",
      //   config: {},
      // },
    ];
  },
};
