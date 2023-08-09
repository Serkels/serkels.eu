/**
 * question controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::question.question",
  ({ strapi }) => ({
    // async find(ctx) {
    //   console.log();
    //   console.log("api::question.question", "find");
    //   console.log(ctx.query);
    //   ctx.query.populate = {
    //     profile: {
    //       fields: [],
    //       populate: {
    //         image: {
    //           fields: ["url"],
    //         },
    //       },
    //     },
    //     opportunity_category: { fields: ["name", "slug"] },
    //   };
    //   console.log(ctx.query, ctx.params);

    //   const sanitizedQuery = await this.sanitizeQuery(ctx);
    //   console.log({ sanitizedQuery });
    //   const { results, pagination } = await strapi
    //     .service("api::question.question")
    //     .find(sanitizedQuery);
    //   console.log({ results, pagination });
    //   return this.transformResponse(results, { pagination });
    // },
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
