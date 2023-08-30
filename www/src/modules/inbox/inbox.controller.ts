//

import { InputError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Inbox } from "@1/modules/inbox/domain";
import {
  InboxList_Schema,
  Inbox_Schema_ToDomain,
  type Message_Schema,
} from "@1/modules/inbox/infra/strapi";
import type { Inbox_ListSchema } from "@1/strapi-openapi";
import { useInfiniteQuery, type QueryFunction } from "@tanstack/react-query";
import debug from "debug";
import { useCallback, useEffect, useState } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Inbox_Repository } from "./inbox.repository";
import { Inbox_QueryKeys } from "./query_keys";

//

const log = debug("~:modules:exchange:Inbox_Controller");

export class Inbox_Controller {
  #to_domain = new Inbox_Schema_ToDomain();

  constructor(private repository: Inbox_Repository) {
    log("new");
  }

  //

  list = { useQuery: this.useListQuery.bind(this) };

  //

  useListQuery(query_params: Strapi_Query_Params<Message_Schema>) {
    const queryKey = Inbox_QueryKeys.lists();
    const load_list_query_fn: QueryFunction<
      Inbox_ListSchema,
      typeof queryKey,
      number
    > = async (params) => {
      debug("load_list_query_fn");
      debug(`page: ${params.pageParam ?? 1}`);

      return this.repository.find_all({
        ...query_params,
        pagination: { ...query_params.pagination, page: params.pageParam ?? 1 },
      });
    };

    const [inboxes, set_inboxes] = useState<Inbox[]>();
    const info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(load_list_query_fn, [this.repository]),
      queryKey,
      staleTime: Infinity,
    });

    useEffect(() => {
      const { data } = info;
      if (!data) return;

      const result = InboxList_Schema.transform(
        this.#to_domain.build_list.bind(this.#to_domain),
      ).parse(data.pages.map((page) => page.data).flat());
      if (result.isFail())
        throw new InputError("useInbox", { cause: result.error() });

      console.log(result.value());

      set_inboxes(result.value());
    }, [info.data, set_inboxes]);

    return { info, inboxes };
  }
}
