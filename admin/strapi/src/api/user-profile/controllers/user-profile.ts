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
        image: {
          fields: ["url"],
        },
        owner: {
          fields: ["email", "username"],
        },
      };

      const { data } = await super.find(ctx);

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      return { data: profile, meta: {} };
    },

    async me_update(ctx) {
      const user: { id: number } = ctx.state.user;

      ctx.query.filters = {
        owner: user.id,
      };
      const { data } = await super.find(ctx);
      const profile = data[0];

      if (profile) {
        ctx.params.id = profile.id;
        return super.update(ctx);
      }

      ctx.request.body.data.owner = user.id;
      return super.create(ctx);
    },

    async findOne(ctx) {
      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
      };
      return super.findOne(ctx);
    },

    async avatar(ctx) {
      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
      };
      const { data } = await super.find(ctx);
      const profile = data[0];
      console.log({ profile });
      return "";
    },

    async findOneByUser(ctx) {
      console.log();
      console.log("findOneByUser");
      const user: { id: number } = ctx.params;
      console.log({ user });

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };

      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
      };

      const { data } = await super.find(ctx);
      console.log({ data });

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      console.log();
      return { data: profile, meta: {} };
    },
  }),
);
