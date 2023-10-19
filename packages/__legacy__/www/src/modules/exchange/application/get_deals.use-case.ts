//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import debug from "debug";
import { getQueryClient } from "~/core/getQueryClient";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Deal_Repository, type Deal_QueryProps } from "../Deal.repository";
import { Deal_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Deals_UseCase {
  #log = debug(`~:modules:exchange:${Get_Deals_UseCase.name}`);

  constructor(
    @inject(Deal_Repository)
    private readonly repository: Deal_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: number, params: Deal_QueryProps) {
    return useInfiniteQuery({
      queryFn: ({ pageParam: page }) => {
        return this.repository.find_all(id, {
          ...params,
          pagination: { ...params.pagination, page },
        });
      },
      queryKey: Deal_QueryKeys.lists(id),
      getNextPageParam,
      getPreviousPageParam,
      select: (data) => {
        return {
          ...data,
          pages: data.pages
            .map((page) => page.data!)
            .flat()
            .map((data) => data.id!),
        };
      },
    });
  }

  async prefetch(id: number, params: Deal_QueryProps) {
    this.#log("prefetch", { id, params });

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
      queryKey: Deal_QueryKeys.lists(id),
      queryFn: ({ pageParam: page }) =>
        this.repository.find_all(id, {
          ...params,
          pagination: { ...params.pagination, page },
        }),
    });

    {
      const { pages } = queryClient.getQueryData<
        InfiniteData<Awaited<ReturnType<typeof this.repository.find_all>>>
      >(Deal_QueryKeys.lists(id)) ?? { pages: [] };

      for (const { data: deals } of pages) {
        for (const data of deals ?? []) {
          queryClient.setQueryData(Deal_QueryKeys.item(Number(data?.id)), data);
        }
      }
    }

    return queryClient;
  }
}
