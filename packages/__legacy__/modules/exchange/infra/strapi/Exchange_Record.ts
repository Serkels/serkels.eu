//

import { Category_Record } from "../../../category/infra/strapi";
import { StrapiEntity } from "../../../common";
import { Profile_Record } from "../../../profile/infra/strapi";
import { Exchange, Exchange_PropsSchema } from "../../domain";

//

export const Exchange_Record = StrapiEntity(
  Exchange_PropsSchema.augment({
    category: Category_Record,
    in_exchange_of: Category_Record,
    profile: Profile_Record,
  }),
)
  .transform(({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Exchange.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  })
  .describe("Maybe Exchange Record");
