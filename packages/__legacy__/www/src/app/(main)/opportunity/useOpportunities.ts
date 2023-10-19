//

import { useInject } from "@1/next-tsyringe";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Opportunity_Repository } from "~/modules/opportunity/opportunity.repository";

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
