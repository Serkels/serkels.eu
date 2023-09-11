//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import type { Exchange_ListSchema } from "@1/strapi-openapi";
import { useInfiniteQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useCallback } from "react";
import { Lifecycle, inject, scoped } from "tsyringe";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Exchanges_QueryProps } from "./Exchange_QueryProps";
import { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_List_Controller");

//

@scoped(Lifecycle.ContainerScoped)
export class Exchange_List_Controller {
  constructor(
    @inject(Exchange_Repository) private repository: Exchange_Repository,
  ) {
    log("new");
  }

  lists = {
    useQuery: this.useListQuery.bind(this),
  };

  my = {
    useQuery: this.useMyListQuery.bind(this),
  };

  useListQuery(params: Exchanges_QueryProps) {
    const loadListFn: QueryFunction<
      Exchange_ListSchema,
      ReturnType<typeof Exchange_QueryKeys.lists>,
      number
    > = async ({ pageParam: page }) => {
      params.pagination = Object.assign(params.pagination ?? {}, {
        page,
      } as Exchanges_QueryProps["pagination"]);
      return this.repository.findAll(params);
    };

    const query_info = useInfiniteQuery({
      enabled: this.repository.is_authorized,
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadListFn, [
        this.repository,
        params.filter?.category,
        params.filter?.search,
      ]),
      queryKey: Exchange_QueryKeys.lists(params.filter),
      staleTime: Infinity,
    });

    return query_info;
  }

  useMyListQuery(params: Exchanges_QueryProps) {
    const loadListFn: QueryFunction<
      Exchange_ListSchema,
      ReturnType<typeof Exchange_QueryKeys.my_list>,
      number
    > = async ({ pageParam: page }) => {
      params.pagination = Object.assign(params.pagination ?? {}, {
        page,
      } as Exchanges_QueryProps["pagination"]);

      return this.repository.findAllMine(params);
    };

    const query_info = useInfiniteQuery({
      enabled: this.repository.is_authorized,
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadListFn, [
        this.repository,
        params.filter?.category,
        params.filter?.search,
      ]),
      queryKey: Exchange_QueryKeys.my_list(),
      staleTime: Infinity,
      select: (data) => {
        const pages = data.pages
          .map((page) => page.data!)
          .flat()
          .map((raw) => new Exchange_ItemSchemaToDomain().build(raw))
          .filter((result) => {
            if (result.isFail()) {
              console.error(result.error());
            }
            return result.isOk();
          })
          .map((result) => result.value());
        return { ...data, pages };
      },
    });

    return query_info;
  }
}
