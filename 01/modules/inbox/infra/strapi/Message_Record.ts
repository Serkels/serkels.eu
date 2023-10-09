//

import { StrapiEntity } from "../../../common";
import { Profile_PropsSchema } from "../../../profile/domain";
import { Profile_Record } from "../../../profile/infra/strapi";
import { Message, Message_PropsSchema } from "../../domain";

//

export const Message_Record = StrapiEntity(
  Message_PropsSchema.augment({
    author: Profile_PropsSchema.transform((data) => ({
      data: { id: data.id, attributes: data },
    })).pipe(Profile_Record),
  }),
)
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
