//

import type { Deal } from "@1/modules/deal/domain";
import { createStateContext } from "react-use";

export const [useDeal_Value, Deal_ValueProvider] = createStateContext<Deal>(
  null as any,
);
