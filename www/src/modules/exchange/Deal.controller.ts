//

import type {
  Exchange_DealListSchema,
  Exchange_DealSchema,
} from "@1/strapi-openapi";
import { startTransaction } from "@sentry/nextjs";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Deal_Repository } from "./Deal.repository";
import { Deal_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Deal_Controller");

//

export class Deal_Controller {
  constructor(private repository: Deal_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };
  by_id = { useQuery: this.useDealQuery.bind(this) };
  list = { useQuery: this.useListQuery.bind(this) };

  //

  useCreateMutation() {
    const { data: session } = useSession();
    // const query_client = useQueryClient();

    const create_deal = async (props: { exchange_id: number }) => {
      log("createDealFn");
      const trace = startTransaction({
        name: "Create Exchange",
      });
      try {
        trace.startChild({
          op: "create record",
        });
        await this.repository.create({
          exchange: props.exchange_id,
        });
      } finally {
        trace.finish();
      }
    };

    const mutation_result = useMutation(
      useCallback(create_deal, [this.repository, session?.user?.id]),
    );

    // useEffect(() => {
    //   if (mutation_result.status !== "success") return;
    //   Promise.all([
    //     query_client.invalidateQueries({
    //       queryKey: Exchange_QueryKeys.lists(),
    //     }),
    //     query_client.invalidateQueries({
    //       queryKey: Deal_Repository.lists(),
    //     }),
    //   ]);
    // }, [mutation_result.isSuccess]);

    return mutation_result;
  }

  useDealQuery(id: number) {
    const queryKey = Deal_QueryKeys.item(id);

    const load_query_fn: QueryFunction<
      Exchange_DealSchema | undefined,
      typeof queryKey,
      number
    > = async () => {
      debug("load_list_query_fn");
      return this.repository.find_by_id(id);
    };

    const query_info = useQuery({
      enabled: Boolean(this.repository.jwt),
      queryFn: useCallback(load_query_fn, [this.repository, id]),
      queryKey,
      staleTime: Infinity,
    });

    return query_info;
  }

  useListQuery(exchange_id: number) {
    const queryKey = Deal_QueryKeys.lists(exchange_id);
    const loadDealsListFn: QueryFunction<
      Exchange_DealListSchema,
      typeof queryKey,
      number
    > = async () => {
      debug("loadDealsListFn");
      return this.repository.find_all(exchange_id);
    };

    const query_info = useInfiniteQuery({
      enabled: Boolean(this.repository.jwt),
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadDealsListFn, [this.repository, exchange_id]),
      queryKey: Deal_QueryKeys.lists(exchange_id),
      staleTime: Infinity,
    });

    return query_info;
  }
}
