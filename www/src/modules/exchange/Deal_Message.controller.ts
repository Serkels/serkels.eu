//

import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
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
import { Lifecycle, inject, scoped } from "~/core/di";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Deal_Message_Repository } from "./Deal_Message.repository";
import { Deal_QueryKeys } from "./queryKeys";

//

//

@scoped(Lifecycle.ContainerScoped)
export class Deal_Message_Controller {
  #log = debug(`~:modules:exchange:${Deal_Message_Controller.name}`);
  constructor(
    @inject(Deal_Message_Repository)
    private readonly repository: Deal_Message_Repository,
  ) {
    this.#log("new");
  }

  create = { useMutation: this.useCreateMutation.bind(this) };
  list = { useQuery: this.useListQuery.bind(this) };

  //

  useCreateMutation() {
    const { data: session } = useSession();
    const query_client = useQueryClient();
    const key = [
      ...Deal_QueryKeys.messages(this.repository.deal_id),
      "create",
    ] as const;
    const create_message = async (message: string) => {
      this.#log("create_message");
      const trace = startTransaction({
        name: `Create Message for the deal ${this.repository.deal_id}`,
      });
      try {
        trace.startChild({
          op: "create record",
        });

        await query_client.cancelQueries({ queryKey: key });
        await this.repository.create({ content: message });
      } finally {
        trace.finish();
      }
    };

    const mutation_result = useMutation({
      mutationKey: key,
      mutationFn: useCallback(create_message, [
        this.repository,
        session?.user?.id,
      ]),
    });

    useEffect(() => {
      Promise.all([
        query_client.invalidateQueries(
          Deal_QueryKeys.messages(this.repository.deal_id),
        ),
        query_client.invalidateQueries(
          Deal_QueryKeys.item(this.repository.deal_id),
        ),
      ]);
    }, [mutation_result.isSuccess]);
    return mutation_result;
  }

  useListQuery(query_params: Strapi_Query_Params<Message_Schema>) {
    const queryKey = Deal_QueryKeys.messages(this.repository.deal_id);
    const load_list_query_fn: QueryFunction<
      Comment_ListSchema,
      typeof queryKey,
      number
    > = async (params) => {
      this.#log("load_list_query_fn");
      this.#log(`page: ${params.pageParam ?? 1}`);

      return this.repository.find_all({
        ...query_params,
        pagination: { ...query_params.pagination, page: params.pageParam ?? 1 },
      });
    };

    const query_info = useInfiniteQuery({
      enabled: this.repository.is_authorized,
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(load_list_query_fn, [this.repository]),
      queryKey,
      staleTime: 1_111,
    });

    return query_info;
  }
}
