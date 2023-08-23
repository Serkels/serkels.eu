//

import type { Exchange_ListSchema } from "@1/strapi-openapi";
import { useInfiniteQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useCallback } from "react";
import type { Exchange_QueryProps } from "./Exchange_QueryProps";
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

  useListQuery(params: Exchange_QueryProps) {
    const loadListFn: QueryFunction<
      Exchange_ListSchema,
      ReturnType<typeof Exchange_QueryKeys.lists>,
      number
    > = async ({ pageParam: page }) => {
      params.pagination = Object.assign(params.pagination ?? {}, {
        page,
      } as Exchange_QueryProps["pagination"]);
      return this.repository.findAll(params);
    };

    const getNextPageParam = (lastPage: Exchange_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
      const { pageCount, page } = pagination;
      if (pageCount === undefined || page === undefined) return;

      return page >= pageCount ? undefined : page + 1;
    };

    const getPreviousPageParam = (lastPage: Exchange_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { page: 0 };
      const { page } = pagination;
      if (page === undefined) return;

      return page > 0 ? page - 1 : undefined;
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
}
