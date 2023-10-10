//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { type UID } from "@1/core/domain";
import { startTransaction } from "@sentry/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { Deal_Message_Repository } from "./Deal_Message.repository";
import { Deal_QueryKeys } from "./queryKeys";

//

//

@scoped(Lifecycle.ContainerScoped)
/**
 * @deprecated use separate application actions
 */
export class Deal_Message_Controller {
  #log = debug(`~:modules:exchange:${Deal_Message_Controller.name}`);
  constructor(
    @inject(Deal_Message_Repository)
    private readonly repository: Deal_Message_Repository,
  ) {
    this.#log("new");
  }

  /**
   * @deprecated
   */
  create = { useMutation: this.useCreateMutation.bind(this) };

  //

  /**
   * @deprecated
   */
  useCreateMutation(deal_id: UID) {
    const { data: session } = useSession();
    const query_client = useQueryClient();
    const key = [
      ...Deal_QueryKeys.messages(deal_id.value()),
      "create",
    ] as const;
    const create_message = async (message: string) => {
      this.#log("create_message");
      const trace = startTransaction({
        name: `Create Message for the deal ${deal_id.value()}`,
      });
      try {
        trace.startChild({
          op: "create record",
        });

        await query_client.cancelQueries({ queryKey: key });
        await this.repository.create(deal_id, { content: message });
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
        query_client.invalidateQueries(Deal_QueryKeys.messages(NaN)),
        query_client.invalidateQueries(Deal_QueryKeys.item(NaN)),
      ]);
    }, [mutation_result.isSuccess]);
    return mutation_result;
  }
}
