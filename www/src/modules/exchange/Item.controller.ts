//

import type {
  Exchange_DealListSchema,
  Exchange_ItemSchema,
} from "@1/strapi-openapi";
import {
  useInfiniteQuery,
  useQuery,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useCallback } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_Item_Controller");

//

export class Exchange_Item_Controller {
  constructor(private repository: Exchange_Repository) {
    log("new");
  }

  item = {
    useQuery: this.useItemQuery.bind(this),
  };
  deals = {
    useQuery: this.useDealsQuery.bind(this),
  };

  useItemQuery(id: number) {
    const loadItemFn: QueryFunction<
      Exchange_ItemSchema | undefined,
      ReturnType<typeof Exchange_QueryKeys.item>,
      number
    > = async () => {
      debug("loadItemFn");
      return this.repository.findById(id);
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(loadItemFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.item(id),
      staleTime: Infinity,
    });

    return query_info;
  }

  useDealsQuery(id: number) {
    const loadDealsListFn: QueryFunction<
      Exchange_DealListSchema,
      ReturnType<typeof Exchange_QueryKeys.deals>,
      number
    > = async () => {
      debug("loadDealsListFn");
      return this.repository.deals(id);
    };

    const query_info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadDealsListFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.deals(id),
      staleTime: Infinity,
    });

    return query_info;
  }
}
