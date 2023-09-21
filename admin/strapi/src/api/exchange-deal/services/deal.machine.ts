//

import { GetValueByKey } from "@strapi/strapi/lib/types/core/attributes";
import { createMachine } from "xstate";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";

//

type Status = GetValueByKey<typeof EXCHANGE_DEAL_API_CONTENT_ID, "status">;

export const deal_flow = createMachine({
  id: "deal",
  initial: "idle",
  states: {
    idle: {
      id: "idle",
      on: {
        DENIE: {
          target: "denied",
        },
        APPROVE: {
          target: "approved by the organizer",
          cond: "is_organizer",
        },
      },
    },
    denied: {
      type: "final",
    },
    "approved by the organizer": {
      on: {
        DENIE: {
          target: "denied",
        },
        APPROVE: {
          target: "approved",
          cond: "is_participant",
        },
      },
    },
    approved: {
      type: "final",
    },
  },
  schema: { events: {} as { type: "DENIE" } | { type: "APPROVE" } },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
