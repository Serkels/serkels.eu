//

import type { StrapiContext } from "@/src/types";
import type { Next } from "koa";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    context.query.populate = {
      ...(context.query.populate || {}),
      profile: {
        fields: ["id", "firstname", "lastname", "university"],
      },
      category: { fields: ["name", "slug"] },
    };
    return next();
  };
};
