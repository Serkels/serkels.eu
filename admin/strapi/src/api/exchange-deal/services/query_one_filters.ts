//

import { ID_Schema } from "@1/core/domain";
import { KoaContext } from "~/types";
import { findOneFromUser } from "../../user-profile/services/user-profile";

//

export async function query_one_filters(
  ctx: KoaContext<unknown, unknown, { deal_id: string; exchange_id: string }>,
) {
  const query = await query_filters(ctx);
  const deal_id = ID_Schema.parse(ctx.params.deal_id, {
    path: ["ctx.params.deal_id"],
  });
  return {
    ...query,
    deal_id,
    filters: {
      id: deal_id,
      ...query.filters,
    },
  };
}

export async function query_filters(
  ctx: KoaContext<unknown, unknown, { exchange_id: string }>,
) {
  const exchange_id = ID_Schema.parse(ctx.params.exchange_id, {
    path: ["ctx.params.exchange_id"],
  });
  const user_id = ID_Schema.parse(ctx.state.user.id, {
    path: ["ctx.state.user.id"],
  });
  const profile = await findOneFromUser(user_id);

  return {
    exchange_id,
    user_id,
    profile,
    filters: {
      exchange: { id: exchange_id },
      $or: [
        { organizer: { id: profile.id } },
        { participant_profile: { id: profile.id } },
      ],
    },
  };
}
