import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Next } from "koa";
import { ID_Schema, KoaContext, StrapiContext } from "~/types";
import { EXCHANGE_API_CONTENT_ID } from "../content-types/exchange";

export default {
  routes: [
    {
      method: "GET",
      path: "/exchanges;owned",
      handler: "api::exchange.exchange.find",
      config: {
        description: "Get the exchanges the user own",
        middlewares: [filter_owned_exchanges, "api::exchange.populate"],
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

async function filter_owned_exchanges(ctx: KoaContext, next: Next) {
  const user_id = ID_Schema.parse(ctx.state.user.id, {
    path: ["ctx.state.user.id"],
  });

  const entityService: EntityService = strapi.entityService;
  const exchanges = await entityService.findMany(EXCHANGE_API_CONTENT_ID, {
    filters: {
      owner: { id: user_id },
    },
  });

  const exchange_ids = exchanges.map(({ id }) => Number(id));
  ctx.query.filters = {
    ...(ctx.query.filters || {}),
    $or: [{ id: exchange_ids }],
  };

  if (exchange_ids.length === 0) {
    ctx.query.filters = {
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
