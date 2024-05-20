"use client";

//

import type { Exchange } from "@1.modules/exchange.domain";
import { createContext, useContext, type PropsWithChildren } from "react";

//

const context = createContext({} as Exchange);

export function useExchange() {
  return useContext(context);
}

export function ExchangeProvider({
  children,
  exchange,
}: PropsWithChildren<{ exchange: Exchange }>) {
  return <context.Provider value={exchange}>{children}</context.Provider>;
}
