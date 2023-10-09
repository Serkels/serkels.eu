//

import { Lifecycle, inject, scoped } from "@1/core/di";
import type { UID } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import { Message } from "@1/modules/inbox/domain";
import {
  Message_Record,
  type Message_Schema,
} from "@1/modules/inbox/infra/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import debug from "debug";
import { z } from "zod";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Deal_Message_Repository } from "../Deal_Message.repository";
import { Deal_QueryKeys } from "../queryKeys";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Messages_ById_UseCase {
  #log = debug(`~:modules:exchange:${Get_Messages_ById_UseCase.name}`);

  constructor(
    @inject(Deal_Message_Repository)
    private readonly repository: Deal_Message_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(deal_id: UID, query_params: Strapi_Query_Params<Message_Schema>) {
    return useInfiniteQuery({
      enabled: this.repository.is_authorized,
      queryFn: () =>
        this.repository.find_all(deal_id, {
          ...query_params,
          pagination: {
            pageSize: 25,
            page: query_params.pagination?.page ?? 1,
          },
        }),
      queryKey: Deal_QueryKeys.messages(deal_id.value()),
      getNextPageParam,
      getPreviousPageParam,
      select: (data) => ({
        pageParams: data.pageParams,
        pages: data.pages
          .map((page) => page.data!)
          .flat()
          .map((data) => {
            console.log({ data: { attributes: data, id: data.id } });
            return Message_Record.pipe(z.instanceof(Message)).parse(
              { data: { attributes: data, id: data.id } },
              {
                path: [`<${Get_Messages_ById_UseCase.name}.execute>`, "data"],
              },
            );
          }),
      }),
    });
  }
}
