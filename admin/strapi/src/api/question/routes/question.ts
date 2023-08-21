//

import { factories } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import type { StrapiRequestContext } from "strapi-typed";

export default factories.createCoreRouter("api::question.question", {
  config: {
    create: {
      middlewares: [clean_body, findProfile, "api::question.populate"],
    },
    delete: {
      middlewares: ["api::question.populate"],
      policies: ["global::is-owned"],
    },
    update: {
      middlewares: ["api::question.populate"],
      policies: ["global::is-owned"],
    },
    find: {
      middlewares: ["api::question.populate"],
    },
    findOne: {
      middlewares: ["api::question.populate"],
    },
  },
});

//

function clean_body(ctx: any, next: Next) {
  const strapi_ctx: Context & {
    request: {
      body: {
        data: GetValues<"api::question.question">;
      };
    };
  } = ctx;
  const { data } = strapi_ctx.request.body;

  if (!data) {
    strapi_ctx.noContent("Missing request body");
    return next();
  }

  if (!data.category) {
    strapi_ctx.badRequest("Missing category");
    return next();
  }

  data.accepted_answer = null;
  data.answer_count = 0;
  data.last_activity = new Date().toISOString();
  data.is_accepted = null;

  return next();
}

async function findProfile(ctx: any, next: Next) {
  const strapi_ctx: Context & {
    request: {
      body: {
        data: GetValues<"api::question.question">;
      };
    };
  } = ctx;

  const entityService: EntityService = strapi.entityService;
  const user = (ctx as StrapiRequestContext).state.user;

  const profiles = await entityService.findMany(
    "api::user-profile.user-profile",
    {
      fields: ["id"],
      filters: { owner: user.id },
    },
  );

  if (profiles.length !== 1) {
    return strapi_ctx.notFound("Profile not found");
  }

  const profile = profiles[0];
  if (!profile) return strapi_ctx.notFound("Profile not found");
  if (!strapi_ctx.request.body)
    return strapi_ctx.internalServerError("No body");
  if (!strapi_ctx.request.body.data)
    return strapi_ctx.internalServerError("No body");

  Object.assign(strapi_ctx.request.body.data, {
    owner: user.id,
    profile: profile.id,
  });

  return next();
}
