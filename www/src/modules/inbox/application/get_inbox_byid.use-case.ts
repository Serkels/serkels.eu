//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { Inbox } from "@1/modules/inbox/domain";
import { Inbox_Record } from "@1/modules/inbox/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { z } from "zod";
import { Inbox_Repository } from "../inbox.repository";
import { Inbox_QueryKeys } from "../query_keys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Inbox_ById_UseCase {
  #log = debug(`~:modules:inbox:${Get_Inbox_ById_UseCase.name}`);

  constructor(
    @inject(Inbox_Repository) private readonly repository: Inbox_Repository,
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
        return Inbox_Record.pipe(z.instanceof(Inbox)).parse(data, {
          path: [`<${Get_Inbox_ById_UseCase.name}.execute>`, "data"],
        });
      },
    });
  }
}
