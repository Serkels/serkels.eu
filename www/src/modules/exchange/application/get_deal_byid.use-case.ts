//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { Deal } from "@1/modules/deal/domain";
import { Deal_Record } from "@1/modules/deal/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { z } from "zod";
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

  execute(exchange_id: number, deal_id: number) {
    return useQuery({
      queryFn: () => this.repository.find_by_id(exchange_id, deal_id),
      queryKey: Deal_QueryKeys.item(deal_id),
      select: (data) => {
        return Deal_Record.pipe(z.instanceof(Deal)).parse(
          { data },
          {
            path: [
              `<${Get_Deal_ById_UseCase.name}.execute(${exchange_id},${deal_id}).useQuery.select>`,
              "{data}",
            ],
          },
        );
      },
    });
  }
}
