//

import { useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
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
    const query_client = useQueryClient();
    this.get_messages.execute(id, {});
    const sdf = query_client.getQueryData(Deal_QueryKeys.messages(id));
    console.log({ sdf });
    return sdf;
  }
}
