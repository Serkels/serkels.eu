//

import {
  InputError,
  Result,
  type IAdapter,
  type IResult,
} from "@1/core/domain";
import { Inbox } from "../../domain";
import type { InboxList_Schema, Inbox_Schema } from "./Inbox_Schema";
import { Thread_Schema_ToDomain } from "./Thread_Schema_ToDomain";

//

function reuslt_all_ok<A = any, B = any, M = any>(
  results: Array<IResult<A, any, any>>,
): IResult<A[], B, M> {
  return Result.Ok(results.filter((r) => r.isOk()).map((r) => r.value()));
}

export class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
  constructor(private thread_schema_todomain: Thread_Schema_ToDomain) {}

  build(target: Inbox_Schema): IResult<Inbox, Error> {
    const thread = this.thread_schema_todomain.build(target.thread.data);

    const all_results = Result.combine([thread]);
    if (all_results.isFail()) {
      return Result.fail(
        new InputError("Inbox SubDomain", { cause: all_results.error() }),
      );
    }

    return Inbox.create({ id: Number(target.id), thread: thread.value() });
  }

  build_list(list: InboxList_Schema): IResult<Inbox[], Error> {
    const results = list.map((inbox) =>
      this.build({ id: inbox.id, ...inbox.attributes }),
    );

    const all_results = Result.combine(results);
    if (all_results.isFail()) {
      return Result.fail(
        new InputError("Inbox SubDomain", { cause: all_results.error() }),
      );
    }

    return reuslt_all_ok(results);
  }
}
