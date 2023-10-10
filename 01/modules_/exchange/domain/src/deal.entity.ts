//

import { z } from "zod";

//

export const deal_state_action_schema = z.union([
  z.literal("approve"),
  z.literal("denie"),
]);
