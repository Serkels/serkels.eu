//

import type { Comment_ListSchema } from "@1/strapi-openapi";
import { startTransaction } from "@sentry/nextjs";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import type { Deal_Message_Repository } from "./Deal_Message.repository";
import type { Messages_QueryProps } from "./Exchange_QueryProps";
import { Deal_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Deal_Message_Controller");

//

export class Deal_Message_Controller {
  constructor(private repository: Deal_Message_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };
  list = { useQuery: this.useListQuery.bind(this) };

  //

  useCreateMutation() {
    const { data: session } = useSession();

    const create_message = async (message: string) => {
      log("create_message");
      const trace = startTransaction({
        name: `Create Message for the deal ${this.repository.deal_id}`,
      });
      try {
        trace.startChild({
          op: "create record",
        });
        await this.repository.create({ content: message });
      } finally {
        trace.finish();
      }
    };

    const mutation_result = useMutation(
      useCallback(create_message, [this.repository, session?.user?.id]),
    );

    const query_client = useQueryClient();
    useEffect(() => {
      console.log({ mutation_result });
      query_client.invalidateQueries(
        Deal_QueryKeys.messages(this.repository.deal_id),
      );
    }, [mutation_result.isSuccess]);
    return mutation_result;
  }

  useListQuery(query_params: Messages_QueryProps) {
    const queryKey = Deal_QueryKeys.messages(this.repository.deal_id);
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
