//

import { ID_Schema } from "@1/core/domain";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import type { KoaContext, Next, Params } from "~/types";
import { findOneFromUser } from "../../user-profile/services/user-profile";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";

//

export async function filter_by_user_id(ctx: KoaContext, next: Next) {
  try {
    const user_id = ID_Schema.parse(ctx.state.user.id, {
      path: ["ctx.state.user.id"],
    });
    const profile = await findOneFromUser(user_id);

    const filters = {
      $or: [
        { organizer: { id: profile.id } },
        { participant_profile: { id: profile.id } },
      ],
    } satisfies Params.Pick<
      typeof EXCHANGE_DEAL_API_CONTENT_ID,
      "filters"
    >["filters"];

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
