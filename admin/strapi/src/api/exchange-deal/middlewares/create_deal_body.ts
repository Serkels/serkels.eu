//

import { ID_Schema } from "@1/core/domain";
import { ValidationError } from "@strapi/utils/dist/errors";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import type { KoaContext, Next, Params } from "~/types";
import { findOneFromUser } from "../../user-profile/services/user-profile";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";

export async function create_deal_body(
  ctx: KoaContext<
    Params.Pick<typeof EXCHANGE_DEAL_API_CONTENT_ID, "data:partial">
  >,
  next: Next,
) {
  try {
    const user_id = ID_Schema.parse(ctx.state.user.id, {
      path: ["ctx.state.user.id"],
    });
    const exchange_id = ID_Schema.parse(ctx.request.body.data?.exchange, {
      path: ["ctx.request.body.data.exchange"],
    });

    const exchange = await strapi.entityService.findOne(
      "api::exchange.exchange",
      exchange_id,
      {
        populate: ["owner"],
      },
    );

    const exchange_owner_id = ID_Schema.parse(exchange?.owner?.id, {
      path: ["exchange.owner.id"],
    });

    if (exchange_owner_id === user_id) {
      throw new ValidationError("One does not simply self participate.");
    }

    const [organizer, participant] = await Promise.all([
      findOneFromUser(exchange_owner_id),
      findOneFromUser(user_id),
    ]);

    const organizer_id = ID_Schema.parse(organizer?.id, {
      path: ["organizer.id"],
    });
    const participant_id = ID_Schema.parse(participant?.id, {
      path: ["organizer.id"],
    });

    ctx.request.body.data = {
      exchange: exchange_id,
      organizer: organizer_id,
      participant_profile: participant_id,
      status: "idle",
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
}
