//

import type { Next } from "koa";
import type { Params, StrapiContext } from "~/types";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    const query = {
      populate: {
        owner: true,
        participant: true,
        exchange: {
          populate: {
            profile: true,
            category: true,
          },
        },
        profile: true,
      },
    } satisfies Params.Pick<typeof EXCHANGE_DEAL_API_CONTENT_ID, "populate">;

    context.query.populate = {
      ...(context.query.populate || {}),
      ...query.populate,
    };

    //
    //
    //

    await next();
  };
};
