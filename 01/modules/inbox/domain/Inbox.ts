//

import { Aggregate, Result } from "@1/core/domain";
import { ZodError, z } from "zod";
import { Entity_Schema } from "../../common/record";
import { Thread } from "./Thread";

//

export const Inbox_PropsSchema = Entity_Schema.augment({
  thread: z.instanceof(Thread).default(Thread.zero),
}).describe("Inbox_PropsSchema");

type Props = z.TypeOf<typeof Inbox_PropsSchema>;
type Props_Input = z.input<typeof Inbox_PropsSchema>;

export class Inbox extends Aggregate<Props> {
  static override create(props: Props_Input): Result<Inbox, ZodError> {
    const result = Inbox_PropsSchema.safeParse(props, {
      path: [`<${Inbox.name}.create>`, "props"],
    });
    if (result.success) {
      return Result.Ok(new Inbox(result.data));
    } else {
      return Result.fail(result.error);
    }
  }

  static zero = Inbox.create({}).value();

  //

  get thread() {
    return this.props.thread;
  }
}
