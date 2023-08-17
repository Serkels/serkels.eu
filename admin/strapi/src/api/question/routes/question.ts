//

import { factories } from "@strapi/strapi";
import type { Next } from "koa";
import { StrapiContext } from "../../../types";

export default factories.createCoreRouter("api::question.question", {
  config: {
    create: {
      middlewares: [
        async function findProfile(
          ctx: StrapiContext & { request: { body: unknown } },
          next: Next,
        ) {
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
});
