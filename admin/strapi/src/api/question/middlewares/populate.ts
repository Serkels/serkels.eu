//

import type { Next } from "koa";
import type { StrapiContext } from "../../../types";

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
