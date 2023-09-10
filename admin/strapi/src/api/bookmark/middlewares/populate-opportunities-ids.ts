//

import type { Next } from "koa";
import type { Params, StrapiContext } from "~/types";
import { BOOKMARK_API_CONTENT_ID } from "../content-types/bookmark";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    const query = {
      populate: {
        opportunities: { fields: ["id"] },
        exchanges: { fields: ["id"] },
      },
    } satisfies Params.Pick<typeof BOOKMARK_API_CONTENT_ID, "populate">;

    context.query.populate = {
      ...(context.query.populate || {}),
      ...query.populate,
    };

    await next();
  };
};
