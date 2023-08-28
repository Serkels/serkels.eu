import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Shared } from "@strapi/strapi/lib/types";
import { Next } from "koa";
import { StrapiContext } from "~/types";
import { ApiExchangeDealExchangeDeal } from "~/types/generated/contentTypes";

export default {
  routes: [
    {
      method: "GET",
      path: "/my/exchanges",
      handler: "api::exchange.exchange.find",
      config: {
        description: "Get user exchanges",
        middlewares: [filter_deal_owner_participant, "api::exchange.populate"],
        policies: [],
      },
      info: { apiName: "api::exchange.exchange", type: "content-api" },
    },
  ],
};

//

async function filter_deal_owner_participant(
  context: StrapiContext,
  next: Next,
) {
  const user = context.state.user;

  const entityService: EntityService = strapi.entityService;
  const deals = await entityService.findMany<
    keyof Shared.ContentTypes,
    ApiExchangeDealExchangeDeal["attributes"]
  >("api::exchange-deal.exchange-deal", {
    filters: { $or: [{ owner: user.id }, { participant: user.id }] },
    populate: [
      "exchange",
    ] as (keyof ApiExchangeDealExchangeDeal["attributes"])[],
  });

  const exchange_ids = deals.map(({ exchange }) => exchange["id"] as number);

  context.query.filters = {
    ...(context.query.filters || {}),
    $or: [{ id: exchange_ids }],
  };
  if (exchange_ids.length === 0) {
    context.query.filters = {
      owner: 0,
    };
  }
  return next();
}
