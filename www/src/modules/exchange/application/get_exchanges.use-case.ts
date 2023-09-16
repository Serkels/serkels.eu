//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import {
  Exchange_Repository,
  type Exchanges_QueryProps,
} from "../infrastructure";
import { Exchange_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Exchanges_UseCase {
  #log = debug(`~:modules:exchange:${Get_Exchanges_UseCase.name}`);
  #mapper = new Exchange_ItemSchemaToDomain();

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(params: Exchanges_QueryProps) {
    return useInfiniteQuery({
      enabled: this.repository.is_authorized,
      queryFn: ({ pageParam: page }) => {
        return this.repository.find_all({
          ...params,
          pagination: { ...params.pagination, page },
        });
      },
      queryKey: Exchange_QueryKeys.lists(params.filters),
      getNextPageParam,
      getPreviousPageParam,
      select: (data) => {
        return {
          ...data,
          pages: data.pages
            .map((page) => page.data!)
            .flat()
            .map((data) => {
              return this.#mapper.build(data).value();
            }),
        };
      },
    });
  }
}
