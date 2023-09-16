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
export class Get_User_Exchanges_UseCase {
  #log = debug(`~:modules:exchange:${Get_User_Exchanges_UseCase.name}`);
  #mapper = new Exchange_ItemSchemaToDomain();

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(query: Exchanges_QueryProps) {
    return useInfiniteQuery({
      enabled: this.repository.is_authorized,
      queryFn: (options) => {
        return this.repository.find_all_mine({
          ...query,
          pagination: { ...query.pagination, page: options.pageParam ?? 1 },
        });
      },
      queryKey: Exchange_QueryKeys.mine(),
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
