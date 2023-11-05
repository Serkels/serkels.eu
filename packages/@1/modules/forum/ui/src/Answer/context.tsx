//

import type { Answer } from "@1.modules/forum.domain";
import constate from "constate";
import { useState } from "react";

//

type Outlet_State =
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useCardContext({ answer }: { answer: Answer }) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  return { outlet, answer };
}
export const [Provider, useAnswer] = constate(
  useCardContext,
  ({ answer }) => answer,
);
