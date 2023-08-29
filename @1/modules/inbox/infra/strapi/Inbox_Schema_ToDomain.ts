//

import {
  InputError,
  Result,
  type IAdapter,
  type IResult,
} from "@1/core/domain";
import { Inbox } from "../../domain";
import type { Inbox_Schema } from "./Inbox_Schema";
import { Thread_Schema_ToDomain } from "./Thread_Schema_ToDomain";

//

export class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
  thread_to_domain = new Thread_Schema_ToDomain();
  build(target: Inbox_Schema): IResult<Inbox, Error> {
    const id = target.id;
    const thread = this.thread_to_domain.build(target.thread);
    const results = Result.combine([thread]);

    if (results.isFail())
      throw new InputError("Inbox SubDomain", {
        cause: results.error(),
      });

    return Inbox.create({ id, thread: thread.value() });
  }
}
