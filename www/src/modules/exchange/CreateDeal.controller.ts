//

import { startTransaction } from "@sentry/nextjs";
import { useMutation } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { Deal_Repository } from "./Deal.repository";

//

const log = debug("~:modules:exchange:Deal_Controller");

//

export class Deal_Controller {
  constructor(private repository: Deal_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };

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
}
