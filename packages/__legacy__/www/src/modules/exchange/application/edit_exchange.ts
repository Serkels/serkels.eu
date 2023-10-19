//

import { Lifecycle, inject, scoped } from "@1/core/di";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Exchange_Repository } from "../Exchange_Repository";
import { Exchange_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Edit_Exchange_UseCase {
  #log = debug(`~:modules:exchange:${Edit_Exchange_UseCase.name}`);

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Exchange_CreateProps) =>
        this.repository.update(id, {
          ...data,
          in_exchange_of:
            data.in_exchange_of === "" ||
            Number.isNaN(Number(data.in_exchange_of))
              ? undefined
              : data.in_exchange_of,
        }),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: Exchange_QueryKeys.item(id),
          }),
        ]);
      },
    });
  }
}
