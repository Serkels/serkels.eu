/**
 * question controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::question.question",
  ({ strapi }) => ({
    async delete(ctx) {
      ctx.query.populate = {
        owner: {
          fields: [],
        },
        opportunity_category: { fields: ["name", "slug"] },
      };
      const { data: question } = await super.findOne(ctx);

      if (question.attributes.owner.id !== ctx.state.user.id) {
        return ctx.forbidden();
      }

      return super.delete(ctx);
    },
  }),
);
