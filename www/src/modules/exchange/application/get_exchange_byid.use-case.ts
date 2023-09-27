//

import type { UID } from "@1/core/domain";
import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_Repository } from "../Exchange_Repository";
import { Exchange_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Exchange_ById_UseCase {
  #log = debug(`~:modules:exchange:${Get_Exchange_ById_UseCase.name}`);

  constructor(
    @inject(Exchange_Repository)
    private readonly repository: Exchange_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: UID) {
    return useQuery({
      enabled: this.repository.is_authorized,
      queryFn: () => this.repository.by_id(id),
      queryKey: Exchange_QueryKeys.item(id.value()),
      select: (data) => {
        return new Exchange_ItemSchemaToDomain().build(data!).value();
      },
    });
  }

  async prefetch(id: UID) {
    this.#log("prefetch", id.value());

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
      queryKey: Exchange_QueryKeys.item(id.value()),
      queryFn: () => this.repository.by_id(id),
    });

    return queryClient;
  }
}
