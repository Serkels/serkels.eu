//

import {
  Exchange_ItemSchemaToDomain,
  Exchange_RecordSchema,
} from "@1/modules/exchange/infra/strapi";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
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
            .map((data, index) => {
              console.log(
                "Get_Exchanges_UseCase.execute.useInfiniteQuery.select",
                `pages[${index}]`,
                "{data}",
                { data },
              );
              return Exchange_RecordSchema.parse(
                { data },
                {
                  path: [
                    "Get_Exchanges_UseCase.execute.useInfiniteQuery.select",
                    `pages[${index}]`,
                    "{data}",
                  ],
                },
              );
            }),
        };
      },
    });
  }

  async prefetch(filters: Exchanges_QueryProps["filters"]) {
    this.#log("prefetch", { filters });

    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery({
      queryKey: Exchange_QueryKeys.lists(filters),
      queryFn: () =>
        this.repository.find_all({
          filters,
          sort: ["createdAt:desc"],
          pagination: { pageSize: 4 },
        }),
    });

    {
      const { pages } = queryClient.getQueryData<
        InfiniteData<Awaited<ReturnType<typeof this.repository.find_all>>>
      >(Exchange_QueryKeys.lists(filters)) ?? { pages: [] };

      for (const { data: exchanges } of pages) {
        for (const data of exchanges ?? []) {
          queryClient.setQueryData(
            Exchange_QueryKeys.item(Number(data?.id)),
            data,
          );
        }
      }
    }

    return queryClient;
  }
}
