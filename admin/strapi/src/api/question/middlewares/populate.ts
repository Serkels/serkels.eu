//

import type { Next } from "koa";
import type { StrapiContext } from "../../../types";

export default () => {
  return async (context: StrapiContext, next: Next) => {
    context.query.populate = {
      ...(context.query.populate || {}),
      // profile: "*",
      profile: {
        fields: ["id", "firstname", "lastname", "university"],
      },
      opportunity_category: { fields: ["name", "slug"] },
    };
    // console.log(context.query);
    return next();
  };
};
