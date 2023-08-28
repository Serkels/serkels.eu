//

import type {
  Common_DiscussionListSchema,
  Exchange_DealListSchema,
  Exchange_DealSchema,
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
import type { Messages_QueryProps } from "./Exchange_QueryProps";
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
  deal = {
    useQuery: this.useDealQuery.bind(this),
  };
  messages = {
    useQuery: this.useDiscussionQuery.bind(this),
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

  useDealQuery(id: number) {
    const loadDealListFn: QueryFunction<
      Exchange_DealSchema | undefined,
      ReturnType<typeof Exchange_QueryKeys.deal>,
      number
    > = async () => {
      debug("loadDealsListFn");
      return this.repository.findDealById(id);
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(loadDealListFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.deal(id),
      staleTime: Infinity,
    });

    return query_info;
  }

  useDiscussionQuery(id: number, query_params: Messages_QueryProps) {
    const loadDiscussionListFn: QueryFunction<
      Common_DiscussionListSchema,
      ReturnType<typeof Exchange_QueryKeys.messages>,
      number
    > = async (params) => {
      debug("loadDiscussionListFn");
      debug(`page: ${params.pageParam ?? 1}`);

      return this.repository.messages(id, {
        ...query_params,
        pagination: { ...query_params.pagination, page: params.pageParam ?? 1 },
      });
    };

    const query_info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadDiscussionListFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.messages(id),
      staleTime: Infinity,
    });

    return query_info;
  }
}
