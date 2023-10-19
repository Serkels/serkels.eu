//

import { Lifecycle, inject, scoped } from "@1/core/di";
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

  execute(id: number) {
    const info = this.get_messages.execute(id, {});

    return useQuery({
      enabled: info.isSuccess,
      queryFn: () => info.data,
      queryKey: Deal_QueryKeys.last_message(id),
    });
  }
}
