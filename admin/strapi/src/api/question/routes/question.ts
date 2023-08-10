/**
 * question router
 */

import { factories } from "@strapi/strapi";
import { Router } from "@strapi/strapi/lib/types/core-api/router";
import type { Next } from "koa";
import { StrapiContext } from "../../../types";

const coreRouter = factories.createCoreRouter("api::question.question", {
  config: {
    create: {
      middlewares: [
        async function findProfile(ctx: StrapiContext, next: Next) {
          const user = ctx.state.user;

          const profiles = await strapi.entityService.findMany(
            "api::user-profile.user-profile",
            {
              fields: ["id"],
              filters: { owner: user.id },
            },
          );

          if (profiles.length !== 1) {
            return ctx.notFound("Profile not found");
          }

          const profile = profiles[0];
          if (!profile) return ctx.notFound("Profile not found");
          if (!ctx.request.body) return ctx.internalServerError("No body");
          if (!ctx.request.body["data"])
            return ctx.internalServerError("No body");

          Object.assign(ctx.request.body["data"], {
            owner: user.id,
            profile: profile.id,
          });

          console.log();
          console.log("strapi/src/api/question/routes/question.ts");

          console.log({ body: ctx.request.body });
          console.log();
          return next();
        },
        "api::question.populate",
      ],
    },
    find: {
      middlewares: ["api::question.populate"],
    },
    findOne: {
      middlewares: ["api::question.populate"],
    },
  },
}) as unknown as Router;

export default {
  get prefix() {
    return coreRouter.prefix;
  },
  get routes() {
    return [
      {
        method: "GET",
        path: "/question/:id/awnsers",
        handler: "plugin::comments.client.findAllFlat",
        config: {
          description: "Get question awnsers",
          middlewares: [
            "api::question.relation",
            "api::question.replate-author-by-profile",
          ],
        },
        info: { apiName: "plugin::comments.comment", type: "content-api" },
      },
      {
        method: "POST",
        path: "/question/:id/awnsers",
        handler: "plugin::comments.client.post",
        config: {
          description: "Get question awnsers",
          middlewares: [
            "api::question.relation",
            "api::question.replate-author-by-profile",
          ],
        },
        info: { apiName: "plugin::comments.comment", type: "content-api" },
      },
      ...coreRouter.routes,
    ];
  },
};
