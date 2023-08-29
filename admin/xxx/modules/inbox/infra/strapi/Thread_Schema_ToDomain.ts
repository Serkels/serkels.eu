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
import type { Thread_Schema } from "./Thread_Schema";

//

export class Thread_Schema_ToDomain implements IAdapter<Thread_Schema, Thread> {
  #message_to_domain = new Message_Schema_ToDomain();
  #profile_to_domain = new Profile_Schema_ToDomain();

  build(target: Thread_Schema): IResult<Thread, Error> {
    const id = target.id;
    const last_message = this.#message_to_domain.build(target.last_message);
    const profile = this.#profile_to_domain.build(target.profile);
    const updated_at = new Date(target.updatedAt);

    const results = Result.combine([profile, last_message]);
    if (results.isFail())
      throw new InputError("Thread_Schema_ToDomain", {
        cause: results.error(),
      });

    return Thread.create({
      id,
      last_message: last_message.value(),
      profile: profile.value(),
      updated_at,
    });
  }
}
