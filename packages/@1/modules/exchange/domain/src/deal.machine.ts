//

import { setup } from "xstate";
import { Deal_Status_Schema } from ".";

//

export const deal_flow = setup({
  types: {} as { events: { type: "DENIE" } | { type: "APPROVE" } },
}).createMachine({
  id: "deal",
  initial: Deal_Status_Schema.Enum.IDLE,
  states: {
    [Deal_Status_Schema.Enum.IDLE]: {
      on: {
        DENIE: {
          target: Deal_Status_Schema.Enum.DENIED,
        },
        APPROVE: {
          target: Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER,
          guard: "is_organizer",
        },
      },
    },
    [Deal_Status_Schema.Enum.DENIED]: {
      type: "final",
    },
    [Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER]: {
      on: {
        DENIE: {
          target: Deal_Status_Schema.Enum.DENIED,
        },
        APPROVE: {
          target: Deal_Status_Schema.Enum.APPROVED,
          guard: "is_participant",
        },
      },
    },
    [Deal_Status_Schema.Enum.APPROVED]: {
      type: "final",
    },
  },
});
