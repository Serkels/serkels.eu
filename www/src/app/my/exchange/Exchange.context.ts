//

import type { Exchange } from "@1/modules/exchange/domain";
import { createStateContext } from "react-use";

export const [useExchange_Value, Exchange_ValueProvider] =
  createStateContext<Exchange>(null as any);
