//

import { useQuery } from "@tanstack/react-query";
import { fromClient, fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/core/getQueryClient";
import { OpportunityCategoriesRepository } from "./OpportunityCategories";

//

export const queryKey = ["categories", "opportunity"] as const;

export function useOpportunityCategoriesQuery() {
  return useQuery({
    queryKey,
    queryFn: () => new OpportunityCategoriesRepository(fromClient).load(),
    staleTime: Infinity,
  });
}

export function useOpportunityCategoriesprefetchQuery() {
  const queryClient = getQueryClient();
  return queryClient.prefetchQuery(queryKey, () =>
    new OpportunityCategoriesRepository(fromServer).load(),
  );
}
