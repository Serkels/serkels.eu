//

import {
  IllegalArgs,
  InputError,
  Result,
  type IAdapter,
  type IResult,
} from "@1/core/domain";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { z } from "zod";
import { z_strapi_entity } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Inbox } from "../../domain";
import type { InboxList_Schema, Inbox_Schema } from "./Inbox_Schema";
import { Thread_Schema_ToDomain } from "./Thread_Schema_ToDomain";

//

function reuslt_all_ok<A = any, B = any, M = any>(
  results: Array<IResult<A, any, any>>,
): IResult<A[], B, M> {
  return Result.Ok(results.filter((r) => r.isOk()).map((r) => r.value()));
}

@scoped(Lifecycle.ContainerScoped)
export class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
  #log = debug(`~:modules:inbox:${Inbox_Schema_ToDomain.name}`);
  constructor(
    @inject(Thread_Schema_ToDomain)
    private readonly thread_schema_todomain: Thread_Schema_ToDomain,
  ) {
    this.#log("new");
  }

  schema = z_strapi_entity(
    z
      .object(
        {
          thread: z.lazy(() =>
            z.any().transform((data) => {
              // TODO(douglasduteil): remove dirty data.data
              return this.thread_schema_todomain.mapper.parse(data.data);
            }),
          ),
        },
        { description: "Inbox Record" },
      )
      .merge(Strapi_Timestamps),
  );

  to_domain = this.schema.transform(function to_domain(data): Inbox {
    if (!data)
      throw new InputError("Inbox_Mapper", {
        errors: [new IllegalArgs("data undefined")],
      });

    const domain = Inbox.create({
      ...data.attributes,
      id: data.id,
      thread: data.attributes.thread,
    });

    if (domain.isFail()) {
      throw new InputError("Inbox_Mapper", { cause: domain.error() });
    }

    return domain.value();
  });

  build(target: Inbox_Schema): IResult<Inbox, Error> {
    const thread = target.thread.data
      ? this.thread_schema_todomain.build(target.thread.data)
      : Result.Ok(undefined);

    const all_results = Result.combine([thread]);
    if (all_results.isFail()) {
      return Result.fail(
        new InputError("Inbox_Schema_ToDomain.build", {
          cause: all_results.error(),
        }),
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
        new InputError("Inbox_Schema_ToDomain.build_list", {
          cause: all_results.error(),
        }),
      );
    }

    return reuslt_all_ok(results);
  }
}
