//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { startTransaction } from "@sentry/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { Deal_Repository } from "./Deal.repository";
import { Deal_QueryKeys, Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Deal_Controller");

//

@scoped(Lifecycle.ContainerScoped)
export class Deal_Controller {
  constructor(@inject(Deal_Repository) private repository: Deal_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };

  //

  useCreateMutation() {
    const { data: session } = useSession();
    const query_client = useQueryClient();
    const key = [...Deal_QueryKeys.all, "create"];

    const create_deal = async (props: { exchange_id: number }) => {
      log("createDealFn");
      const trace = startTransaction({
        name: "Create Exchange",
      });
      try {
        trace.startChild({
          op: "create record",
        });
        await query_client.cancelQueries({ queryKey: key });
        return this.repository.create({
          exchange: props.exchange_id,
          status: "idle",
        });
      } finally {
        trace.finish();
      }
    };

    const mutation_result = useMutation({
      mutationKey: key,
      mutationFn: useCallback(create_deal, [
        this.repository,
        session?.user?.id,
      ]),
      onSuccess: () => {
        // Invalidate and refetch
        return Promise.all([
          query_client.invalidateQueries({
            queryKey: Exchange_QueryKeys.lists(),
          }),
        ]);
      },
    });

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
}
