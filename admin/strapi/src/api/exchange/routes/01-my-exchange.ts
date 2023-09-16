import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Next } from "koa";
import { StrapiContext } from "~/types";

export default {
  routes: [
    {
      method: "GET",
      path: "/exchanges;owned",
      handler: "api::exchange.exchange.find",
      config: {
        description: "Get the exchanges the user own",
        middlewares: [filter_owned_deals, "api::exchange.populate"],
        policies: [],
      },
      info: { apiName: "api::exchange.exchange", type: "content-api" },
    },
    {
      method: "GET",
      path: "/exchanges;participe",
      handler: "api::exchange.exchange.find",
      config: {
        description: "Get the exchanges the user participe in",
        middlewares: [filter_deal_owner_participant, "api::exchange.populate"],
        policies: [],
      },
      info: { apiName: "api::exchange.exchange", type: "content-api" },
    },
  ],
};

//

async function filter_owned_deals(context: StrapiContext, next: Next) {
  const user = context.state.user;

  const entityService: EntityService = strapi.entityService;
  const deals = await entityService.findMany(
    "api::exchange-deal.exchange-deal",
    {
      filters: {
        owner: { id: user.id } as any,
      },
      populate: ["exchange"],
    },
  );

  const exchange_ids = deals.map(({ exchange }) => exchange["id"] as number);
  context.query.filters = {
    ...(context.query.filters || {}),
    $or: [{ id: exchange_ids }],
  };

  if (exchange_ids.length === 0) {
    context.query.filters = {
      id: 0,
    };
  }

  return next();
}

async function filter_deal_owner_participant(
  context: StrapiContext,
  next: Next,
) {
  const user = context.state.user;

  const entityService: EntityService = strapi.entityService;
  const deals = await entityService.findMany(
    "api::exchange-deal.exchange-deal",
    {
      filters: {
        $or: [
          { owner: { id: user.id } as any },
          { participant: { id: user.id } as any },
        ],
      },
      populate: ["exchange"],
    },
  );

  const exchange_ids = deals.map(({ exchange }) => exchange["id"] as number);

  context.query.filters = {
    ...(context.query.filters || {}),
    $or: [{ id: exchange_ids }],
  };

  if (exchange_ids.length === 0) {
    context.query.filters = {
      id: 0,
    };
  }
  return next();
}
