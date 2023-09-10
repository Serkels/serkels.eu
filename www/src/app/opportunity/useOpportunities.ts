//

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInject } from "~/core/react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Opportunity_Repository } from "~/modules/opportunity/opportunity.repository";
import { Opportunities } from "./data/OpportunityRepository";

export function useOpportunitiesInfinite({
  category,
  query,
  pageSize,
  sort = "expireAt:desc",
}: {
  category?: string;
  query?: string;
  pageSize?: number;
  sort?: any;
}) {
  const repository = useInject(Opportunity_Repository);

  return useInfiniteQuery({
    queryKey: ["opportunities", { category, query }],
    queryFn: (options) =>
      repository.find_all({
        pagination: { pageSize, page: options.pageParam ?? 1 },
        filters: { category, search: query },
        sort,
      }),
    getNextPageParam,
    getPreviousPageParam,
  });
}

export function useOpportunities({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["opportunities", limit, category],
    queryFn: async () => {
      return Opportunities.load({
        category,
        limit,
        page: undefined,
        pageSize: undefined,
      });
    },
  });
}
