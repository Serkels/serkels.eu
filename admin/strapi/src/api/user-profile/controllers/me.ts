/**
 * user-profile controller
 */

import { Common } from "@strapi/strapi";
import { sanitize } from "@strapi/utils";
import { type Next } from "koa";
import { findOneFromUser } from "../services/user-profile";

export default {
  async find(ctx, next: Next) {
    const contentType = strapi.contentType("api::user-profile.user-profile");

    const user: { id: number } = ctx.state.user;
    const profile = await findOneFromUser(user.id);

    return sanitize.contentAPI.output({ data: profile }, contentType, {
      auth: ctx.state.auth,
    });
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

    const profile = await findOneFromUser(user.id);
    const constroller = strapi.controller<Common.UID.ContentType>(
      "api::user-profile.user-profile",
    );

    if (profile) {
      ctx.params.id = profile.id;
      return constroller.update(ctx, next);
    }

    ctx.request.body.data.owner = user.id;
    return constroller.create(ctx, next);
  },
};
