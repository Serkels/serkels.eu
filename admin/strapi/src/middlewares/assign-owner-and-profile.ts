//

import type { Next } from "koa";
import type { StrapiContext } from "~/types";
import { findOneFromUser } from "../api/user-profile/services/user-profile";
//

export default () => {
  return async (ctx: StrapiContext, next: Next) => {
    const user = ctx.state.user;
    const data = ctx.request["body"]?.data;
    const user_id = Number(user.id);

    if (!data || Number.isNaN(user_id)) {
      strapi.log.warn(`global::assign-owner-and-profile detected no user`);
      return next();
    }

    data.owner = user_id;

    const profile = await findOneFromUser(user_id);
    if (!profile) {
      strapi.log.warn(`global::assign-owner-and-profile detected no profile`);
      return next();
    }

    data.profile = profile.id;

    await next();
  };
};
