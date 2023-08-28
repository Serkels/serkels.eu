/**
 * exchange router
 */

import { factories } from "@strapi/strapi";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import type { Context } from "@strapi/utils/dist/types";
import type { Next } from "koa";

export default factories.createCoreRouter("api::exchange.exchange", {
  config: {
    create: {
      middlewares: [
        clean_body,
        "global::assign-owner-and-profile",
        "api::exchange.populate",
      ],
    },
    delete: {
      middlewares: ["api::exchange.populate"],
      policies: ["global::is-owned"],
    },
    update: {
      middlewares: ["api::exchange.populate"],
      policies: ["global::is-owned"],
    },
    find: {
      middlewares: ["api::exchange.populate"],
    },
    findOne: {
      middlewares: ["api::exchange.populate"],
    },
  },
});

//

function clean_body(ctx: any, next: Next) {
  const strapi_ctx: Context & {
    request: {
      body: {
        data: GetValues<"api::exchange.exchange">;
      };
    };
  } = ctx;
  const { data } = strapi_ctx.request.body;

  if (!data) {
    return ctx.send({ error: "UnprocessableEntity" }, 422);
  }

  if (!data.category) {
    strapi_ctx.badRequest("Missing category");
    return next();
  }

  data.places = Math.min(data.places, 100);
  data.available_places = data.places;

  return next();
}
