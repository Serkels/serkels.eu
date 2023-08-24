"use client";

import type { Exchange } from "@1/modules/exchange/domain";
import { createContext } from "react";

//

export type Exchange_CardStatus = {};

export const Exchange_CardContext = createContext<{
  exchange: Exchange;
}>({} as any);
