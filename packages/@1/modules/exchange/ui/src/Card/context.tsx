//

import type { Exchange } from "@1.modules/exchange.domain";
import constate from "constate";
import { useState } from "react";

//

type Outlet_State =
  | { state: "deleting" }
  | { state: "error"; error: Error }
  | { state: "idle" }
  | { state: "loading" }
  | { state: "should_delete" };

function useCardContext({
  exchange,
  is_yours,
}: {
  exchange: Exchange;
  is_yours?: boolean | undefined;
}) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  return { outlet, exchange, is_yours: is_yours ?? false };
}

export const [Provider, useExchange, useOutletState, useExchangeMeta] =
  constate(
    useCardContext,
    ({ exchange }) => exchange,
    ({ outlet }) => outlet,
    ({ is_yours }) => ({ is_yours }),
  );
