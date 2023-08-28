/**
 * exchange-deal router
 */

import { factories } from "@strapi/strapi";
import type {
  ApiContentTypes,
  Context,
  EntityService,
  Next,
  PolicyImplementation,
  Shared,
  StrapiContext,
} from "~/src/types";
import { findOneFromUser } from "../../user-profile/services/user-profile";

export default factories.createCoreRouter("api::exchange-deal.exchange-deal", {
  only: ["create", "findOne"],
  config: {
    create: {
      middlewares: [enforce_body],
      policies: [exchange_id_must_exist as unknown as PolicyImplementation],
    },
    findOne: { middlewares: ["api::exchange-deal.populate"] },
  },
});

//

async function exchange_id_must_exist(
  ...[policyContext, _cfg, { strapi }]: Parameters<PolicyImplementation>
) {
  const entityService: EntityService = strapi.entityService;
  const strapi_ctx: StrapiContext & {
    request: {
      body?: {
        data?: { exchange: unknown; owner: unknown };
      };
    };
    state: { user: { id: number } };
  } = policyContext as any;

  if (!strapi_ctx.request.body) {
    strapi.log.warn(`api::exchange-deal requires a request body`);
    return false;
  }
  const { exchange } = strapi_ctx.request.body.data ?? {};
  const exchange_id = Number(exchange);
  if (!exchange || Number.isNaN(exchange_id)) {
    strapi.log.warn(`api::exchange-deal requires an exchange id in the body`);
    return false;
  }

  const exchange_count = await entityService.count<
    keyof Shared.ContentTypes,
    number
  >("api::exchange.exchange", {
    filters: {
      id: exchange_id,
      owner: { $not: strapi_ctx.state.user.id },
    },
  });

  return Boolean(exchange_count === 1);
}

async function enforce_body(ctx: Context, next: Next) {
  const entityService: EntityService = strapi.entityService;
  const strapi_ctx: StrapiContext & {
    request: {
      body?: {
        data?: {
          exchange: unknown;
          owner: unknown;
          participant: unknown;
          profile: unknown;
        };
      };
    };
    state: { user: { id: number } };
  } = ctx as any;

  if (!strapi_ctx.request.body) {
    strapi.log.warn(`api::exchange-deal requires a request body`);
    return false;
  }

  const { data } = strapi_ctx.request.body ?? { data: { exchange: NaN } };
  const exchange_id = Number(data.exchange);

  if (Number.isNaN(exchange_id)) {
    strapi.log.warn(`api::exchange-deal requires an exchange id in the body`);
    return false;
  }

  const exchange = await entityService.findOne<
    keyof Shared.ContentTypes,
    ApiContentTypes.ApiExchangeExchange["attributes"]
  >("api::exchange.exchange", exchange_id, {
    populate: ["owner"],
  });

  const profile = await findOneFromUser(strapi_ctx.state.user.id);
  if (!profile) {
    strapi.log.warn(`api::exchange-deal requires an user with a profile`);
    return false;
  }

  strapi_ctx.request.body = {
    data: {
      exchange: exchange_id,
      owner: exchange.owner["id"],
      participant: strapi_ctx.state.user.id,
      profile: profile.id,
    },
  };

  //

  await next();
}
