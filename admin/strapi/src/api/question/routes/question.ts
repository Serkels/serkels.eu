//

import { factories } from "@strapi/strapi";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";

export default factories.createCoreRouter("api::question.question", {
  config: {
    create: {
      middlewares: [
        clean_body,
        "global::assign-owner-and-profile",
        "api::question.populate",
      ],
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
