//

import type { Question } from "@1.modules/forum.domain";
import constate from "constate";
import { useState } from "react";

//

type Outlet_State =
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useCardContext({ question }: { question: Question }) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  return { outlet, question };
}
export const [Provider, useQuestion, useOutletState] = constate(
  useCardContext,
  ({ question }) => question,
  ({ outlet }) => outlet,
);
