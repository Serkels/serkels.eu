//

import { StrapiEntity } from "../../../common";
import { Message, Message_PropsSchema } from "../../domain";

//

export const Message_Record = StrapiEntity(Message_PropsSchema)
  .transform(({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Message.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  })
  .describe("Maybe Message Record");
