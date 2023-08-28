//

import type { Exchange_ListSchema } from "@1/strapi-openapi";
import { useInfiniteQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useCallback } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Exchanges_QueryProps } from "./Exchange_QueryProps";
import type { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_List_Controller");

//

export class Exchange_List_Controller {
  constructor(private repository: Exchange_Repository) {
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
      enabled: Boolean(this.repository.jwt),
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
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadListFn, [
        this.repository,
        params.filter?.category,
        params.filter?.search,
      ]),
      queryKey: Exchange_QueryKeys.my_list(),
      staleTime: Infinity,
    });

    return query_info;
  }
}
