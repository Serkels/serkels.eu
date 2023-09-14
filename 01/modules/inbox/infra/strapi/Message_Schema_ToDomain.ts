//

import { type IAdapter, type IResult } from "@1/core/domain";
import { Message } from "../../domain";
import type { Message_DataSchema } from "./Message_Schema";

export class Message_Schema_ToDomain
  implements IAdapter<Message_DataSchema, Message>
{
  build(target: Message_DataSchema): IResult<Message, Error> {
    const id = Number(target.id);
    const content = target.attributes.content;
    return Message.create({ id, content });
  }
}
