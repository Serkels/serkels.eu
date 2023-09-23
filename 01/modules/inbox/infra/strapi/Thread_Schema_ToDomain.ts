//

import {
  Fail,
  IllegalArgs,
  InputError,
  Ok,
  Result,
  USER_PROFILE_ID_TOKEN,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { z } from "zod";
import { z_strapi_entity } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile_Mapper } from "../../../profile/infra/strapi";
import { Thread } from "../../domain";
import { Message_Mapper } from "./Message_Schema";
import { Thread_DataSchema, Thread_RecordSchema } from "./Thread_Schema";

//

@scoped(Lifecycle.ContainerScoped)
export class Thread_Schema_ToDomain
  implements IAdapter<Thread_DataSchema, Thread>
{
  #log = debug(`~:modules:inbox:${Thread_Schema_ToDomain.name}`);
  constructor(
    @inject(USER_PROFILE_ID_TOKEN) private readonly user_profile_id: number,
  ) {
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

  mapper = this.schema.transform((data) => {
    if (!data)
      throw new InputError("Thread_Mapper: data undefined", {
        errors: [new IllegalArgs("data undefined")],
      });
    const { participants, last_message, updatedAt } = data.attributes;
    const profile = participants.data.find(
      (profile) => profile.get("id") !== this.user_profile_id,
    );
    if (!profile) {
      throw new InputError("Thread_Mapper: profile not found", {});
    }
    const domain = Thread.create({
      id: data.id,
      profile,
      last_message,
      updated_at: updatedAt,
    });

    if (domain.isFail()) {
      throw new InputError("Thread_Mapper", { cause: domain.error() });
    }

    return domain.value();
  });

  build(data: Thread_DataSchema): Result<Thread, ErrorInstance> {
    try {
      return Ok(
        Thread_RecordSchema.parse(
          { data },
          {
            path: [
              ...JSON.stringify({ data }, null, 2)
                .replaceAll('"', '"')
                .split("\n"),

              "=",
              "data",
            ],
          },
        ),
      );
    } catch (error) {
      return Fail(
        new IllegalArgs("Exchange_ItemSchemaToDomain.build", {
          cause: error,
        }),
      );
    }
  }
  // build(target: Thread_DataSchema): IResult<Thread, Error> {
  //   const last_message = target.attributes.last_message?.data
  //     ? this.#message_to_domain.build(target.attributes.last_message.data)
  //     : Result.Ok(undefined);
  //   const profile_data = target.attributes.participants.data.find(
  //     ({ id }) => id !== this.user_profile_id,
  //   );
  //   if (!profile_data) {
  //     return Result.fail(new InputError("Are you alone in this thread ?", {}));
  //   }
  //   const profile = this.#profile_to_domain.build(profile_data);

  //   const all_results = Result.combine([profile, last_message]);
  //   if (all_results.isFail()) {
  //     return Result.fail(
  //       new InputError("Thread_Schema_ToDomain.build", {
  //         cause: all_results.error(),
  //       }),
  //     );
  //   }

  //   return Thread.create({
  //     id: target.id,
  //     updated_at: target.attributes.updatedAt,
  //     profile: profile.value(),
  //     last_message: last_message.value(),
  //   });
  // }
}
