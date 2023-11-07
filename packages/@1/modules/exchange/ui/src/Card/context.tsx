//

import type { Exchange } from "@1.modules/exchange.domain";
import constate from "constate";
import { useState } from "react";
import { createStateContext } from "react-use";

//

type Outlet_State =
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useCardContext({ exchange }: { exchange: Exchange }) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  return { outlet, exchange };
}

export const [Provider, useExchange, useOutletState] = constate(
  useCardContext,
  ({ exchange }) => exchange,
  ({ outlet }) => outlet,
);

export const [useExchange_Value, Exchange_ValueProvider] = createStateContext(
  {} as Exchange,
);
