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

type Awnsers_Outlet_State =
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "hidden" }
  | { state: "idle" }
  | { state: "loading" };

function useCardContext({ question }: { question: Question }) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  const answers_outlet = useState<Awnsers_Outlet_State>({ state: "hidden" });
  return { answers_outlet, outlet, question };
}
export const [Provider, useQuestion, useOutletState, useAwnsersOutletState] =
  constate(
    useCardContext,
    ({ question }) => question,
    ({ outlet }) => outlet,
    ({ answers_outlet }) => answers_outlet,
  );
