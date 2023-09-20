//

import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Inbox_Repository } from "../inbox.repository";
import { Inbox_QueryKeys } from "../query_keys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Inboxes_UseCase {
  #log = debug(`~:modules:inbox:${Get_Inboxes_UseCase.name}`);

  constructor(
    @inject(Inbox_Repository)
    private readonly repository: Inbox_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(query_params: Strapi_Query_Params<Message_Schema>) {
    return useInfiniteQuery({
      enabled: this.repository.is_authorized,
      queryFn: ({ pageParam: page }) => {
        return this.repository.find_all({
          ...query_params,
          pagination: { ...query_params.pagination, page },
        });
      },
      queryKey: Inbox_QueryKeys.lists(),
      getNextPageParam,
      getPreviousPageParam,
      select: (data) => {
        return {
          ...data,
          pages: data.pages
            .map((page) => page.data!)
            .flat()
            .map((data) => data.id!),
        };
      },
    });
  }
}
