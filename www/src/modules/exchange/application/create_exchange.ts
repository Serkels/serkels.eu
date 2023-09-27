//

import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Exchange_Repository } from "../Exchange_Repository";
import { Exchange_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Create_Exchange_UseCase {
  #log = debug(`~:modules:exchange:${Create_Exchange_UseCase.name}`);

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Exchange_CreateProps) => this.repository.create(data),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: Exchange_QueryKeys.lists(),
          }),
          queryClient.invalidateQueries({
            queryKey: Exchange_QueryKeys.owned(),
          }),
        ]);
      },
    });
  }
}
