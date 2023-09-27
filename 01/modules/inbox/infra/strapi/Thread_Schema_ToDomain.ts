//

import { Result, type ErrorInstance, type IAdapter } from "@1/core/domain";
import debug from "debug";
import { Lifecycle, scoped } from "tsyringe";
import { z } from "zod";
import { z_strapi_entity } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile_Mapper } from "../../../profile/infra/strapi";
import { Thread } from "../../domain";
import { Message_Mapper } from "./Message_Schema";
import { Thread_DataSchema } from "./Thread_Schema";

//

@scoped(Lifecycle.ContainerScoped)
export class Thread_Schema_ToDomain
  implements IAdapter<Thread_DataSchema, Thread>
{
  #log = debug(`~:modules:inbox:${Thread_Schema_ToDomain.name}`);
  constructor() // @inject(USER_PROFILE_ID_TOKEN) private readonly user_profile_id: number,
  {
    this.#log("new");
  }

  schema = z_strapi_entity(
    z
      .object(
        {
          participants: z.object({
            data: z
              .any()
              .transform((data) => {
                return Profile_Mapper.parse({ data });
              })
              .array(),
          }),
          last_message: Message_Mapper,
        },
        { description: "Thread Record" },
      )
      .merge(Strapi_Timestamps),
  );

  build(data: Thread_DataSchema): Result<Thread, ErrorInstance> {
    return Thread.create(data);
  }
}
