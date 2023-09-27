//

import { Deal_Record } from "@1/modules/deal/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Deal_Repository } from "../Deal.repository";
import { Deal_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Deal_ById_UseCase {
  #log = debug(`~:modules:exchange:${Get_Deal_ById_UseCase.name}`);

  constructor(
    @inject(Deal_Repository)
    private readonly repository: Deal_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: number) {
    return useQuery({
      queryFn: () => this.repository.find_by_id(id),
      queryKey: Deal_QueryKeys.item(id),
      select: (data) => {
        console.log("Get_Deal_ById_UseCase.execute.select data=", { data });
        return Deal_Record.parse(
          { data },
          {
            path: [
              "Get_Deal_ById_UseCase",
              `execute(${id})`,
              "select",
              "Deal_Record.parse",
              "//",
              "{data}",
            ],
          },
        );
      },
    });
  }
}
