//

import { Entity, Result } from "@1/core/domain";
import { z, type ZodError } from "zod";
import { Entity_Schema } from "../../common/record";

//

export const Message_PropsSchema = Entity_Schema.augment({
  content: z.string().default(""),
  author: z.any(),
});

//

type Props = z.TypeOf<typeof Message_PropsSchema>;
type Props_Input = z.input<typeof Message_PropsSchema>;

//
export class Message extends Entity<Props> {
  static override create(props: Props_Input): Result<Message, ZodError> {
    const result = Message_PropsSchema.safeParse(props, {
      path: [`<${Message.name}.create>`, "props"],
    });
    if (result.success) {
      return Result.Ok(new Message(result.data));
    } else {
      return Result.fail(result.error);
    }
  }

  static zero = z.instanceof(Message).parse(Message.create({}).value());

  //

  get the_excerpt() {
    return this.props.content.trim().slice(0, 123);
  }
}
