//

import { createMachine } from "xstate";

//

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
