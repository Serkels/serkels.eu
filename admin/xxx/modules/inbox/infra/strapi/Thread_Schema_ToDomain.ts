//

import {
  InputError,
  Result,
  type IAdapter,
  type IResult,
} from "@1/core/domain";
import { Profile_Schema_ToDomain } from "../../../profile/infra/strapi";
import { Thread } from "../../domain";
import { Message_Schema_ToDomain } from "./Message_Schema_ToDomain";
import type { Thread_DataSchema } from "./Thread_Schema";

//

export class Thread_Schema_ToDomain
  implements IAdapter<Thread_DataSchema, Thread>
{
  constructor(private user_profile_id: number) {}
  #message_to_domain = new Message_Schema_ToDomain();
  #profile_to_domain = new Profile_Schema_ToDomain();

  build(target: Thread_DataSchema): IResult<Thread, Error> {
    const last_message = target.attributes.last_message?.data
      ? this.#message_to_domain.build(target.attributes.last_message.data)
      : Result.Ok(undefined);
    const profile_data = target.attributes.participants.data.find(
      ({ id }) => id !== this.user_profile_id,
    );
    if (!profile_data) {
      return Result.fail(new InputError("Are you alone in this thread ?", {}));
    }
    const profile = this.#profile_to_domain.build(profile_data);

    const all_results = Result.combine([profile, last_message]);
    if (all_results.isFail()) {
      return Result.fail(
        new InputError("Thread_Schema_ToDomain.build", {
          cause: all_results.error(),
        }),
      );
    }

    return Thread.create({
      id: target.id,
      updated_at: target.attributes.updatedAt,
      profile: profile.value(),
      last_message: last_message.value(),
    });
  }
}
