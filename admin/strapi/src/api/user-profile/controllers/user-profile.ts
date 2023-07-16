/**
 * user-profile controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    async me(ctx) {
      const user: { id: number } = ctx.state.user;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };

      ctx.query.populate = {
        bookmarks: {
          fields: ["slug"],
        },
      };

      const { data } = await super.find(ctx);

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      return { id: profile.id, ...profile.attributes };
    },

    async me_update(ctx) {
      console.log("me_update", { ctx });
      console.log("me_update ctx.params", ctx.params);
      console.log("me_update ctx.params", this.me);
      const { id } = await this.me(ctx);
      console.log("me_update id", { id });
      ctx.params.id = id;
      const response = await super.update(ctx);
      return response;
    },
  }),
);
