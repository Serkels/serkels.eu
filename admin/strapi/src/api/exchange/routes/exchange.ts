/**
 * exchange router
 */

import { ID_Schema } from "@1/core/domain";
import { Exchange_Create_Schema } from "@1/modules/exchange/domain";
import { factories } from "@strapi/strapi";
import type { Next } from "koa";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { KoaContext, Params } from "~/types";
import { findOneFromUser } from "../../user-profile/services/user-profile";
import { EXCHANGE_API_CONTENT_ID } from "../content-types/exchange";

export default factories.createCoreRouter("api::exchange.exchange", {
  config: {
    create: {
      middlewares: [clean_body, "api::exchange.populate"],
    },
    delete: {
      middlewares: ["api::exchange.populate"],
      policies: ["global::is-owned"],
    },
    update: {
      middlewares: ["api::exchange.populate"],
      policies: ["global::is-owned"],
    },
    find: {
      middlewares: ["api::exchange.populate"],
    },
    findOne: {
      middlewares: ["api::exchange.populate"],
    },
  },
});

//

async function clean_body(
  ctx: KoaContext<
    Params.Pick<typeof EXCHANGE_API_CONTENT_ID, "data:partial">,
    { data: { id: number } }
  >,
  next: Next,
) {
  const { data } = ctx.request.body;

  if (!data) {
    return ctx.send({ error: "UnprocessableEntity" }, 422);
  }

  if (!data.category) {
    return ctx.badRequest("Missing category");
  }
  try {
    const user_id = ID_Schema.parse(ctx.state.user.id, {
      path: ["ctx.state.user.id"],
    });

    const profile = await findOneFromUser(user_id);
    const profile_id = ID_Schema.parse(profile?.id, {
      path: ["profile.id"],
    });

    const new_exchange = Exchange_Create_Schema.parse(data, { path: ["data"] });

    ctx.request.body.data = {
      ...new_exchange,
      profile: profile_id,
      available_places: new_exchange.places,
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

  await next();

  //
  //
  //

  const user_id = ID_Schema.parse(ctx.state.user.id, {
    path: ["ctx.state.user.id"],
  });
  const exchange = ctx.body.data;
  await strapi.entityService.update(EXCHANGE_API_CONTENT_ID, exchange.id, {
    data: { owner: user_id },
  });
}
