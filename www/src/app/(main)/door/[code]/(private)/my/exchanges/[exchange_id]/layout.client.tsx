"use client";

import { createStateContext } from "react-use";

//

const [useExchange_Route_Context, Exchange_Route_Provider] = createStateContext(
  { exchange_id: NaN },
);

export { Exchange_Route_Provider, useExchange_Route_Context };
