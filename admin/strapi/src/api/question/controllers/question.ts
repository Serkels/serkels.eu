/**
 * question controller
 */

import { factories } from "@strapi/strapi";
import { StrapiRequestContext } from "strapi-typed";

export default factories.createCoreController(
  "api::question.question",
  ({ strapi }) => ({
    async awnsers_count(
      ctx: StrapiRequestContext<never, never, { id: string }>,
    ) {
      const { params } = ctx;
      const { id } = params;
      const where = { related: `api::question.question:${id}` };

      return await strapi.db
        .query(strapi.plugin("comments").contentTypes["comment"]?.uid as string)
        .count({
          where,
        });
    },

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
