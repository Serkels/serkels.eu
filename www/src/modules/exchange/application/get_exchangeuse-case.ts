//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Exchange_Repository } from "../infrastructure";
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

  execute(id: number) {
    return useQuery({
      queryFn: () => this.repository.findById(id),
      queryKey: Exchange_QueryKeys.item(id),
      select: (data) => {
        return new Exchange_ItemSchemaToDomain().build(data!).value();
      },
    });
  }
}
