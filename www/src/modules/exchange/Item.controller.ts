//

import type {
  Exchange_DiscussionListSchema,
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
  discussions = {
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

  useDiscussionQuery(id: number) {
    const loadDiscussionListFn: QueryFunction<
      Exchange_DiscussionListSchema,
      ReturnType<typeof Exchange_QueryKeys.discussions>,
      number
    > = async () => {
      debug("loadDiscussionListFn");
      return this.repository.discussions(id);
    };

    const query_info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadDiscussionListFn, [this.repository, id]),
      queryKey: Exchange_QueryKeys.discussions(id),
      staleTime: Infinity,
    });

    return query_info;
  }
}
