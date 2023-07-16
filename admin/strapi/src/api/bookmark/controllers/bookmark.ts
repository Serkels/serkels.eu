/**
 * bookmark controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::bookmark.bookmark",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      console.log();
      console.log(__filename, "create");
      console.log({ user, ctx });
      console.log();
      const bookmark = await super.create(ctx);
      console.log();
      console.log(__filename, "create");
      console.log({ bookmark });
      console.log();

      const updated = await strapi.entityService.update(
        "api::bookmark.bookmark",
        bookmark.data.id,
        {
          data: {
            owner: user.id,
          },
        },
      );
      console.log();
      console.log(__filename, "create");
      console.log({ updated });
      console.log();

      return updated;
    },

    async find(ctx) {
      const user = ctx.state.user;

      console.log();
      console.log(__filename, "find");
      console.log({ user });
      console.log();

      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      console.log();
      console.log(__filename, "find");
      console.log({ sanitizedQueryParams });
      console.log();

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };
      console.log();
      console.log(__filename, "find");
      console.log({ filters: ctx.query.filters });
      console.log();

      return super.find(ctx);
    },
  }),
);
