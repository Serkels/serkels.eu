//

import { useInfiniteQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Deal_Repository } from "../Deal.repository";
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

  execute(id: number, ) {
    return useInfiniteQuery({
      // queryFn: ({ pageParam: page }) => {
      //   return this.repository.find_all({
      //     ...params,
      //     pagination: { ...params.pagination, page },
      //   });
      // },
      // TODO(douglasduteil): use actual pagination
      queryFn: () => this.repository.find_all(id),
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
}
