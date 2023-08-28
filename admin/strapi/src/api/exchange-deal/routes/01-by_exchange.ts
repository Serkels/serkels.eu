import { Context, Next } from "koa";

export default {
  routes: [
    {
      method: "GET",
      path: "/exchanges/:id/deals",
      handler: "api::exchange-deal.exchange-deal.find",
      config: {
        description: "Get exchange deals",
        middlewares: [filter_deal_owner_participant],
        policies: [
          // only_owned_or_participant_deal
        ],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
  ],
};

//

async function filter_deal_owner_participant(context, next: Next) {
  const ctx: Context = context;
  const {
    params: { id },
  } = ctx;
  const user = context.state.user;

  ctx.params = {};

  context.query.filters = {
    ...(context.query.filters || {}),
    $and: [{ exchange: Number(id) }],
    $or: [{ owner: user.id }, { participant: user.id }],
  };

  context.query.populate = {
    ...(context.query.populate || {}),
    owner: {
      fields: ["id"],
    },
    participant: {
      fields: ["id"],
    },
    last_message: {
      fields: ["id", "content", "author"],
    },
    profile: {
      fields: ["id", "firstname", "lastname", "university"],
    },
  };

  return next();
}

// async function filter_deal_owner_participant(
//   context: StrapiContext,
//   next: Next,
// ) {
//   const user = context.state.user;

//   const entityService: EntityService = strapi.entityService;
//   const deals = await entityService.findMany<
//     keyof Shared.ContentTypes,
//     ApiExchangeDealExchangeDeal["attributes"]
//   >("api::exchange-deal.exchange-deal", {
//     filters: { $or: [{ owner: user.id }, { participant: user.id }] },
//     populate: [
//       "exchange",
//     ] as (keyof ApiExchangeDealExchangeDeal["attributes"])[],
//   });

//   const exchange_ids = deals.map(({ exchange }) => exchange["id"] as number);

//   context.query.filters = {
//     ...(context.query.filters || {}),
//     $or: [{ id: exchange_ids }],
//   };
//   if (exchange_ids.length === 0) {
//     context.query.filters = {
//       owner: 0,
//     };
//   }
//   return next();
// }

// async function only_owned_or_participant_deal(...[policyContext, config, { strapi }]: Parameters<PolicyImplementation>) {
//   const strapi_ctx: StrapiContext = policyContext as any;
//   const user = strapi_ctx.state.user;
//   const entityService: EntityService = strapi.entityService;

//   const deals = await entityService.findMany<
//     keyof Shared.ContentTypes,
//     ApiExchangeDealExchangeDeal["attributes"]
//   >("api::exchange-deal.exchange-deal", {
//     filters: { $or: [{ owner: user.id }, { participant: user.id }] },
//     populate: [
//       "exchange",
//     ] as (keyof ApiExchangeDealExchangeDeal["attributes"])[],

//   return false;
// }
