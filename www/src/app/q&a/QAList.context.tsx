"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

//

export const OpportunityFilterContext = createContext<{
  statefulQuery: [string, Dispatch<SetStateAction<string>>];
}>({} as any);
