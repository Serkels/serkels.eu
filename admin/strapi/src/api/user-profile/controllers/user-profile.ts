/**
 * user-profile controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    async findOne(ctx) {
      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
        contacts: true,
      };
      return super.findOne(ctx);
    },

    async findOneByUser(ctx) {
      const user: { id: number } = ctx.params;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };

      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
        contacts: true,
      };

      const { data } = await super.find(ctx);

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      return { data: profile, meta: {} };
    },
  }),
);
