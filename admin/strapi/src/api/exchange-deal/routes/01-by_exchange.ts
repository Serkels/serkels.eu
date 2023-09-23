//

import { ID_Schema } from "@1/core/domain";
import type { Next } from "koa";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { set_params_to_nope } from "~/src/middlewares/set_params_to_nope";
import { type KoaContext } from "~/types";
import { deal_state_action_schema } from "../content-types/exchange-deal";
import { status_patching } from "../middlewares/status_patching";
import { assert_deal_access } from "../policies/assert_deal_access";
import { query_filters } from "../services/query_one_filters";

//

export default {
  routes: [
    {
      method: "PATCH",
      path: "/exchanges/:exchange_id/deals/:deal_id/status/:action",
      handler: "api::exchange-deal.exchange-deal.update",
      config: {
        description: "Get exchange deals",
        middlewares: [
          status_patching(),
          set_id_to_deal_id(),
          "global::populate-all",
          //
          // next()
          //
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                exchange_id: ID_Schema,
                deal_id: ID_Schema,
                action: deal_state_action_schema,
              }),
            },
          },
          assert_deal_access,
        ],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },

    //
    {
      method: "GET",
      path: "/exchanges/:exchange_id/deals/:deal_id",
      handler: "api::exchange-deal.exchange-deal.findOne",
      config: {
        description: "Get exchange deals",
        middlewares: [
          set_id_to_deal_id(),
          "global::populate-all",
          //
          // next()
          //
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                exchange_id: ID_Schema,
                deal_id: ID_Schema,
              }),
            },
          },
          assert_deal_access,
        ],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },

    //

    {
      method: "GET",
      path: "/exchanges/:exchange_id/deals",
      handler: "api::exchange-deal.exchange-deal.find",
      config: {
        description: "Get exchange deals",
        middlewares: [
          filter_by_exchange_and_user_id,
          set_params_to_nope(),
          "global::populate-all",
          //
          // next()
          //
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                exchange_id: ID_Schema,
              }),
            },
          },
        ],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
  ],
};

function set_id_to_deal_id() {
  return async function set_id_to_deal_id(ctx: KoaContext, next: Next) {
    try {
      const deal_id = ID_Schema.parse(ctx.params.deal_id, {
        path: ["ctx.params.deal_id"],
      });
      ctx.params = { id: deal_id };
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
  };
}

async function filter_by_exchange_and_user_id(ctx: KoaContext, next: Next) {
  try {
    const { filters } = await query_filters(ctx);

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      ...filters,
    };
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
