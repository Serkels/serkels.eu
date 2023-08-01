/**
 * bookmark router
 */

import { factories } from "@strapi/strapi";
import { Router } from "@strapi/strapi/lib/types/core-api/router";
import type { Next } from "koa";
import type { StrapiContext } from "../../../types";

const coreRouter = factories.createCoreRouter(
  "api::bookmark.bookmark",
) as unknown as Router;

export default {
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
              const owner = ctx.state.user?.id;
              const bookmarks = await strapi.entityService.findMany(
                "api::bookmark.bookmark",
                {
                  populate: "*",
                },
                { filters: { owner } },
              );

              if (bookmarks.length !== 1) {
                return;
              }

              const id = String(bookmarks[0].id);

              //

              ctx.params = { id };
              return next();
            },
            "api::bookmark.populate-opportunities",
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
