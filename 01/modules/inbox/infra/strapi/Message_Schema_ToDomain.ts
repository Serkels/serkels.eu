//

import { type IAdapter, type IResult } from "@1/core/domain";
import { Profile_Mapper } from "../../../profile/infra/strapi";
import { Message } from "../../domain";
import type { Message_DataSchema } from "./Message_Schema";

export class Message_Schema_ToDomain
  implements IAdapter<Message_DataSchema, Message>
{
  build(target: Message_DataSchema): IResult<Message, Error> {
    const id = Number(target.id);
    const content = target.attributes.content;
    const author = target.attributes.author;
    const profile = Profile_Mapper.parse({
      data: { id: author?.data?.id, attributes: author },
    });
    return Message.create({ id, content, author: profile });
  }
}
