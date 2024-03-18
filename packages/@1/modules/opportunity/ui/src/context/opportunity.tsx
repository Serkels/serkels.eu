"use client";

import type { Opportunity } from "@1.modules/opportunity.domain";
import { createContext, useContext, type PropsWithChildren } from "react";

//

export const OpportunityContext = createContext({} as Opportunity);

export function OpportunityProvider({
  children,
  opportunity,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  return (
    <OpportunityContext.Provider value={opportunity}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunity() {
  return useContext(OpportunityContext);
}
