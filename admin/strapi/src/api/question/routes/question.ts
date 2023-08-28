//

import { factories } from "@strapi/strapi";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import { ValidationError } from "@strapi/utils/dist/errors";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";
import type { KoaContext } from "~/types";

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
      middlewares: ["api::question.populate", update_edited_at],
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
    throw new ValidationError("Empty body data", ctx.request.body);
  }

  if (!data.title) {
    throw new ValidationError("Missing title", ctx.request.body);
  }

  if (!data.category) {
    throw new ValidationError("Missing category", ctx.request.body);
  }

  data.accepted_answer = null;
  data.answer_count = 0;
  data.last_activity = new Date().toISOString();
  data.is_accepted = null;

  return next();
}

export interface KoaResponseContext<ResponseBody>
  extends KoaContext<any, ResponseBody> {}

function update_edited_at(
  context: KoaContext<
    { data: Partial<GetValues<"api::question.question">> },
    any
  >,
  next: Next,
) {
  const body = context.request.body;
  if (!context.request.body) {
    throw new ValidationError("Empty body", context.request.body);
  }
  if (!context.request.body.data) {
    throw new ValidationError("Empty body data", context.request.body);
  }

  if (context.request.body.data.title) {
    context.request.body.data.edited_at = new Date().toISOString();
  }

  return next();
}
