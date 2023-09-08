//

import { AuthError, InputError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Inbox } from "@1/modules/inbox/domain";
import {
  InboxList_Schema,
  Inbox_DataSchema,
  Inbox_Schema_ToDomain,
  Thread_Schema_ToDomain,
  type Message_Schema,
} from "@1/modules/inbox/infra/strapi";
import type { Inbox_ItemSchema, Inbox_ListSchema } from "@1/strapi-openapi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Inbox_Repository } from "./inbox.repository";
import { Inbox_QueryKeys } from "./query_keys";

//

const log = debug("~:modules:exchange:Inbox_Controller");

export class Inbox_Controller {
  #to_domain: Inbox_Schema_ToDomain | undefined;

  constructor(private repository: Inbox_Repository) {
    log("new");
  }

  //

  by_participent = {
    useQuery: (id: number) => {
      return useQuery({
        queryFn: () => this.repository.find_by_participant(id),
        queryKey: Inbox_QueryKeys.by_participent(id),
        staleTime: Infinity,
        retry: false,
      });
    },
    useMutation: (id: number) => {
      return useMutation({
        mutationFn: () => this.repository.create(id),
      });
    },
  };

  by_id = { useQuery: this.useInboxQuery.bind(this) };
  list = { useQuery: this.useListQuery.bind(this) };

  //

  useInboxQuery(id: number) {
    const mapper = this.#useUser_Inbox_Schema_ToDomain();
    const queryKey = Inbox_QueryKeys.item(id);

    const load_query_fn: QueryFunction<
      Inbox_ItemSchema | undefined,
      typeof queryKey,
      number
    > = async () => {
      debug("load_list_query_fn");
      return this.repository.find_by_id(id);
    };

    const [inbox, set_inbox] = useState<Inbox>();
    const info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(load_query_fn, [this.repository, id]),
      queryKey,
      staleTime: Infinity,
    });

    useEffect(() => {
      const { data } = info;
      if (!data) return;
      if (!mapper) throw new AuthError("User profile not reconized");

      const result = Inbox_DataSchema.transform(({ id, attributes }) => {
        return mapper.build({ id, ...attributes });
      }).parse(data);

      if (result.isFail())
        throw new InputError("useInbox", { cause: result.error() });

      set_inbox(result.value());
    }, [info.data, set_inbox, mapper]);

    return { info, inbox };
  }

  useListQuery(query_params: Strapi_Query_Params<Message_Schema>) {
    const mapper = this.#useUser_Inbox_Schema_ToDomain();

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
      if (!mapper) throw new AuthError("User profile not reconized");

      const flatten_data = data.pages.map((page) => page.data).flat();
      if (flatten_data.length === 0) {
        set_inboxes([]);
        return;
      }
      const result = InboxList_Schema.transform((list) =>
        mapper.build_list(list),
      ).parse(data.pages.map((page) => page.data).flat());

      if (result.isFail())
        throw new InputError("useInbox", { cause: result.error() });

      set_inboxes(result.value());
    }, [mapper, info.data, set_inboxes]);

    return { info, inboxes };
  }

  #useUser_Inbox_Schema_ToDomain() {
    const { data: session } = useSession();

    //

    if (this.#to_domain) return this.#to_domain;

    const profile_id = session?.user?.profile.id;
    if (!profile_id) return;

    this.#to_domain = new Inbox_Schema_ToDomain(
      new Thread_Schema_ToDomain(profile_id),
    );
    return this.#to_domain;
  }
}
