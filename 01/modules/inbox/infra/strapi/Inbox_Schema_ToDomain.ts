//

import {
  Fail,
  IllegalArgs,
  Ok,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Inbox_Schema } from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, scoped } from "tsyringe";
import { Inbox } from "../../domain";
import { Inbox_Record } from "./Inbox_Schema";

//

// function reuslt_all_ok<A = any, B = any, M = any>(
//   results: Array<IResult<A, any, any>>,
// ): IResult<A[], B, M> {
//   return Result.Ok(results.filter((r) => r.isOk()).map((r) => r.value()));
// }

@scoped(Lifecycle.ContainerScoped)
export class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
  #log = debug(`~:modules:inbox:${Inbox_Schema_ToDomain.name}`);
  constructor() {
    this.#log("new");
  }

  build(data: Inbox_Schema): Result<Inbox, ErrorInstance> {
    try {
      return Ok(
        Inbox_Record.parse(
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
  // build(target: Inbox_Schema): IResult<Inbox, Error> {
  //   const thread = target.thread.data
  //     ? this.thread_schema_todomain.build(target.thread.data)
  //     : Result.Ok(undefined);

  //   const all_results = Result.combine([thread]);
  //   if (all_results.isFail()) {
  //     return Result.fail(
  //       new InputError("Inbox_Schema_ToDomain.build", {
  //         cause: all_results.error(),
  //       }),
  //     );
  //   }

  //   return Inbox.create({ id: Number(target.id), thread: thread.value() });
  // }
}
