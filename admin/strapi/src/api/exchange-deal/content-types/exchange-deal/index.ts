//

import type { Common } from "@strapi/strapi";
import { z } from "zod";

//

export const EXCHANGE_DEAL_API_CONTENT_ID =
  "api::exchange-deal.exchange-deal" as const satisfies Common.UID.ContentType;

// export const deal_state_schema = z.union([
//   z.literal<GetValueByKey<typeof EXCHANGE_DEAL_API_CONTENT_ID, "status">>(
//     "approved",
//   ),
//   z.literal<GetValueByKey<typeof EXCHANGE_DEAL_API_CONTENT_ID, "status">>(
//     "approved by the organizer",
//   ),
//   z.literal<GetValueByKey<typeof EXCHANGE_DEAL_API_CONTENT_ID, "status">>(
//     "denied",
//   ),
//   z.literal<GetValueByKey<typeof EXCHANGE_DEAL_API_CONTENT_ID, "status">>(
//     "idle",
//   ),
// ]);

export const deal_state_action_schema = z.union([
  z.literal("approve"),
  z.literal("denie"),
]);
