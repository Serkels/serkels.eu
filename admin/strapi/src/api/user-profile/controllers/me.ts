/**
 * user-profile controller
 */

import { Common } from "@strapi/strapi";
import { type Next } from "koa";
import { findOneFromUser } from "../services/user-profile";

export default {
  async find(ctx, next: Next) {
    const constroller = strapi.controller<Common.UID.ContentType>(
      "api::user-profile.user-profile",
    );

    const user: { id: number } = ctx.state.user;
    const profile = await findOneFromUser(user.id);

    ctx.params.id = profile.id;
    return constroller.findOne(ctx, next);
  },

  async update(ctx, next: Next) {
    const user: { id: number } = ctx.state.user;
    ctx.query.populate = {
      ...(ctx.query.populate || {}),
      image: {
        fields: ["url"],
      },
      contacts: {
        fields: ["id"],
      },
      owner: {
        fields: ["email", "username"],
      },
    };

    let profile = await findOneFromUser(user.id);
    const constroller = strapi.controller<Common.UID.ContentType>(
      "api::user-profile.user-profile",
    );

    if (profile) {
      ctx.params.id = profile.id;
      await constroller.update(ctx, next);
    } else {
      ctx.request.body.data.owner = user.id;
      await constroller.create(ctx, next);
    }

    profile = await findOneFromUser(user.id);
    ctx.params.id = profile?.id;
    return constroller.findOne(ctx, next);
  },
};
