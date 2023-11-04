//

import { StateError } from "@1.modules/core/errors";
import type { Exchange } from "@1.modules/exchange.domain";
import constate from "constate";
import { useState } from "react";

//

type Outlet_State =
  | { state: "creating deal"; message: string }
  | { state: "idle" }
  | { state: "sent" };

function useOutlet({ exchange }: { exchange: Exchange }) {
  const [context, setContext] = useState<Outlet_State>({ state: "idle" });
  return { context, set_context: setContext, exchange };
}

export const [
  Outlet_Provider,
  useOutlet_Context,
  useOutlet_State,
  useOutlet_Send,
  useOutlet_Exchange,
] = constate(
  useOutlet,
  ({ context }) => context,
  ({ context }) => context.state,
  ({ set_context }) => set_context,
  ({ exchange }) => exchange,
);

export function useOutlet_RequireContext<
  TState extends Pick<Outlet_State, "state">,
>(expect: TState) {
  const context = useOutlet_Context();

  if (expect.state === context.state) {
    return context as Extract<Outlet_State, TState>;
  }

  throw new StateError(`expect "${expect.state}" but is "${context.state}`);
}
