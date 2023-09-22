//

import { AuthError } from "@1/core/error";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import { Type } from "@1/modules/exchange/domain/Type.value";
import * as Sentry from "@sentry/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import type { Exchange_Repository } from "./infrastructure";
import { Exchange_QueryKeys } from "./queryKeys";

//

const log = debug("~:modules:exchange:Exchange_CreateForm_Controller");

//

export class Exchange_CreateForm_Controller {
  constructor(private repository: Exchange_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };

  useCreateMutation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const createExchangeFn = async (props: Exchange_CreateProps) => {
      log("createExchangeFn");
      const trace = Sentry.startTransaction({
        name: "Create Exchange",
      });
      trace.startChild({
        op: "create record",
      });
      const id = session?.user?.id;
      if (!id) throw new AuthError("Invalid Session");
      const { in_exchange_of, ...other_props } = props;
      await this.repository
        .create({
          ...other_props,
          ...(in_exchange_of ? { in_exchange_of } : {}),
          type: Type.create(props.type).value().get("value"),
        })
        .finally(() => trace.finish());
    };

    const mutation_result = useMutation(
      useCallback(createExchangeFn, [this.repository, session?.user?.id]),
    );

    useEffect(() => {
      if (mutation_result.status !== "success") return;
      Promise.all([
        queryClient.invalidateQueries({ queryKey: Exchange_QueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: Exchange_QueryKeys.owned() }),
      ]);
    }, [mutation_result.isSuccess]);

    return mutation_result;
  }
}
