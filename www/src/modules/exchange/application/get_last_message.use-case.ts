//

import { Lifecycle, inject, scoped } from "@1/core/di";
import type { UID } from "@1/core/domain";
import { Message } from "@1/modules/inbox/domain";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Deal_QueryKeys } from "../queryKeys";
import { Get_Messages_ById_UseCase } from "./get_messages.use-case";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Last_Message_ById_UseCase {
  #log = debug(`~:modules:exchange:${Get_Last_Message_ById_UseCase.name}`);

  constructor(
    @inject(Get_Messages_ById_UseCase)
    private readonly get_messages: Get_Messages_ById_UseCase,
  ) {
    this.#log("new");
  }

  //

  execute(deal_id: UID) {
    const info = this.get_messages.execute(deal_id, {});

    return useQuery({
      enabled: info.isSuccess,
      queryFn: () => info.data?.pages.pop(),
      queryKey: Deal_QueryKeys.last_message(deal_id.value()),
      select: (last_message) =>
        last_message ??
        Message.create({
          content: "...",
        }).value(),
    });
  }
}
