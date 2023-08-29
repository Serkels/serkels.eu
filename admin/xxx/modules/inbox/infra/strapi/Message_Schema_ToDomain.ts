//

import { type IAdapter, type IResult } from "@1/core/domain";
import { Message } from "../../domain";
import type { Message_Schema } from "./Message_Schema";

export class Message_Schema_ToDomain
  implements IAdapter<Message_Schema, Message>
{
  build(target: Message_Schema): IResult<Message, Error> {
    const id = target.id;
    const content = target.content;
    return Message.create({ id, content });
  }
}
