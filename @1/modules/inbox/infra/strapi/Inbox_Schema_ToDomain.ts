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
  thread_to_domain = new Thread_Schema_ToDomain();
  build(target: Inbox_Schema): IResult<Inbox, Error> {
    return Inbox.create({ id: Number(target.id), thread: { id: 0 } as any });
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
