//

import { Inbox_Schema_ToDomain } from "@1/modules/inbox/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Inbox_Repository } from "../inbox.repository";
import { Inbox_QueryKeys } from "../query_keys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Inbox_ById_UseCase {
  #log = debug(`~:modules:inbox:${Get_Inbox_ById_UseCase.name}`);

  constructor(
    @inject(Inbox_Repository) private readonly repository: Inbox_Repository,
    @inject(Inbox_Schema_ToDomain)
    private readonly mapper: Inbox_Schema_ToDomain,
  ) {
    this.#log("new");
  }

  //

  execute(id: number) {
    return useQuery({
      enabled: this.repository.is_authorized,
      queryFn: () => {
        return this.repository.find_by_id(id);
      },
      queryKey: Inbox_QueryKeys.item(id),
      select: (data) => {
        return this.mapper.to_domain.parse(data, {
          path: ["Get_Inbox_ById_UseCase", "data"],
        });
      },
    });
  }
}
