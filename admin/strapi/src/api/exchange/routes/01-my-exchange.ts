import { ID_Schema } from "@1/core/domain";
import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Next } from "koa";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { KoaContext } from "~/types";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../../exchange-deal/content-types/exchange-deal";
import { findOneFromUser } from "../../user-profile/services/user-profile";
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
        middlewares: [
          filter_organizer_or_participant,
          "api::exchange.populate",
        ],
        policies: [],
      },
      info: { apiName: "api::exchange.exchange", type: "content-api" },
    },
  ],
};

//

async function filter_owned_exchanges(ctx: KoaContext, next: Next) {
  try {
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
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.badRequest(fromZodError(error));
    }

    return ctx.badRequest(error);
  }

  //
  //
  //

  return next();
}

async function filter_organizer_or_participant(ctx: KoaContext, next: Next) {
  try {
    const user_id = ID_Schema.parse(ctx.state.user.id, {
      path: ["ctx.state.user.id"],
    });

    const profile = await findOneFromUser(user_id);
    const profile_id = ID_Schema.parse(profile.id, {
      path: ["profile.id"],
    });

    const entityService: EntityService = strapi.entityService;
    const deals = await entityService.findMany(EXCHANGE_DEAL_API_CONTENT_ID, {
      filters: {
        $or: [
          { organizer: { id: profile_id } },
          { participant_profile: { id: profile_id } },
        ],
      },
      populate: { exchange: { fields: ["id"] } },
    });

    const exchange_ids = deals.map(({ exchange }) => exchange.id);

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      $or: [{ id: exchange_ids }],
    };

    if (exchange_ids.length === 0) {
      ctx.query.filters = {
        id: 0,
      };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.badRequest(fromZodError(error));
    }

    return ctx.badRequest(error);
  }

  //
  //
  //

  return next();
}
