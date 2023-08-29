//

import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import {
  useInfiniteQuery,
  useMutation,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { tracer } from "~/core/tracer";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Inbox_Message_Repository } from "./inbox_message.repository";
import { Inbox_QueryKeys } from "./query_keys";

//

const log = debug("~:modules:exchange:Inbox_Message_Controller");

export class Inbox_Message_Controller {
  constructor(private repository: Inbox_Message_Repository) {
    log("new");
  }

  create = { useMutation: this.useCreateMutation.bind(this) };
  list = { useQuery: this.useListQuery.bind(this) };

  //

  useCreateMutation() {
    const { data: session } = useSession();

    const create_message = async (message: string) => {
      log("create_message", { message });

      const trace = tracer({
        name: `Create Message for the inbox ${this.repository.thread_id}`,
      });

      trace.startChild({
        op: "create record",
      });

      try {
        await this.repository.create({ content: message });
      } finally {
        trace[Symbol.dispose]();
      }
    };

    const mutation_result = useMutation(
      useCallback(create_message, [this.repository, session?.user?.id]),
    );

    // const query_client = useQueryClient();
    // useEffect(() => {
    //   console.log({ mutation_result });
    //   query_client.invalidateQueries(
    //     Deal_QueryKeys.messages(this.repository.inbox_id),
    //   );
    // }, [mutation_result.isSuccess]);
    return mutation_result;
  }

  useListQuery(query_params: Strapi_Query_Params<Message_Schema>) {
    const queryKey = Inbox_QueryKeys.messages(this.repository.thread_id);
    const load_list_query_fn: QueryFunction<
      Comment_ListSchema,
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

    const query_info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(load_list_query_fn, [this.repository]),
      queryKey,
      staleTime: Infinity,
    });

    return query_info;
  }
}
