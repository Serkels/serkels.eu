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

      return { id: profile.id, ...profile.attributes };
    },

    async me_update(ctx) {
      const user: { id: number } = ctx.state.user;

      ctx.query.filters = {
        owner: user.id,
      };
      const { data } = await super.find(ctx);
      const profile = data[0];
      console.log();
      console.log("strapi/src/api/user-profile/controllers/user-profile.ts");
      console.log("super.find(ctx)");
      console.log({ profile });
      console.log();

      if (profile) {
        ctx.params.id = profile.id;
        return super.update(ctx);
      }

      ctx.request.body.data.owner = user.id;
      console.log();
      console.log("strapi/src/api/user-profile/controllers/user-profile.ts");
      console.log("super.create(ctx)");
      console.log({ body: ctx.request.body });
      console.log();
      return super.create(ctx);
      // try {
      //   const res = await this.me(ctx);
      //   if (!res) throw new Error("Profile Not Found");
      //   console.log("me_update > me", { res });
      //   const response = await super.update(ctx);
      //   console.log("me_update > update", { response });
      //   return response;
      // } catch (error) {
      //   console.error(error);

      //   const user: { id: number } = ctx.state.user;
      //   console.log("me_update > create", { user });
      //   ctx.request.body.data.owner = ctx.state.user.id;
      //   const response = await super.create(ctx);
      //   console.log("me_update > create", { response });
      //   return response;
      // }
    },
  }),
);
