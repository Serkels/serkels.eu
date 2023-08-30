//

import type { Next } from "koa";
import type { StrapiContext } from "~/types";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    context.query.populate = {
      ...(context.query.populate || {}),
      owner: {
        fields: ["id"],
      },
      participant: {
        fields: ["id"],
      },
      last_message: true,
      profile: {
        fields: ["id", "firstname", "lastname", "university"],
      },
    };

    await next();

    console.log(context.body);
  };
};
