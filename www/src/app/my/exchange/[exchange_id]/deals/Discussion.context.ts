//

import type { Deal } from "@1/modules/deals/domain";
import { createStateContext } from "react-use";

export const [useDiscussion_Value, Discussion_ValueProvider] =
  createStateContext<Deal>(null as any);
