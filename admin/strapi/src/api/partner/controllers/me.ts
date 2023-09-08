/**
 * user-profile controller
 */

import { Common } from "@strapi/strapi";
import { type Next } from "koa";
import { findOneFromUser } from "../services/partner";

export default {
  async find(ctx, next: Next) {
    const user: { id: number } = ctx.state.user;
    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      owner: user.id,
    };

    ctx.query.populate = {
      owner: {
        fields: ["email", "username"],
      },
      ...(ctx.query.populate || {}),
    };

    const constroller = strapi.controller<Common.UID.ContentType>(
      "api::partner.partner",
    );
    const profile = await findOneFromUser(user.id);
    ctx.params.id = profile.id;
    return constroller.findOne(ctx, next);
  },

  async update(ctx, next: Next) {
    const user: { id: number } = ctx.state.user;
    ctx.query.populate = {
      ...(ctx.query.populate || {}),
      owner: {
        fields: ["email", "username"],
      },
    };

    const profile = await findOneFromUser(user.id);
    const constroller = strapi.controller<Common.UID.ContentType>(
      "api::partner.partner",
    );

    if (profile) {
      ctx.params.id = profile.id;
      return constroller.update(ctx, next);
    }

    ctx.request.body.data.owner = user.id;
    return constroller.create(ctx, next);
  },
};
