/**
 * inbox router
 */

import { factories } from "@strapi/strapi";
import { ValidationError } from "@strapi/utils/dist/errors";
import { Comment, KoaContext, Next } from "~/types";
import { set_default_populate } from "../middlewares/set_default_populate";

export default factories.createCoreRouter("api::inbox.inbox", {
  only: ["find", "findOne"],
  config: {
    find: {
      middlewares: [
        set_default_populate, // "api::inbox.set_default_populate",
        "global::filter-by-owner",
      ],
    },
    findOne: {
      middlewares: [
        set_default_populate, // "api::inbox.set_default_populate",
        "global::filter-by-owner",
      ],
    },
  },
});

//

async function clean_your_body(
  ctx: KoaContext<Partial<Pick<Comment, "content">>>,
  next: Next,
) {
  const data = ctx.request.body;

  if (!data) {
    throw new ValidationError("Empty body data", ctx.request.body);
  }
  if (!data.content) {
    throw new ValidationError("Empty message content", ctx.request.body);
  }
  if (!data.content) {
    throw new ValidationError("Empty message content", ctx.request.body);
  }

  ctx.request.body = { content: data.content };

  await next();
}
