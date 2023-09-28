//

import { z } from "zod";
import { StrapiEntity } from "../../../common";
import { Exchange_PropsSchema } from "../../../exchange/domain";
import { Profile } from "../../../profile/domain";
import { Profile_Record } from "../../../profile/infra/strapi";
import { Deal, Deal_PropsSchema } from "../../domain";

//

export const Deal_Record = StrapiEntity(
  Deal_PropsSchema.augment({
    exchange: StrapiEntity(
      Exchange_PropsSchema.omit({
        category: true,
        in_exchange_of: true,
        profile: true,
      }),
    ),
    participant_profile: Profile_Record.pipe(z.instanceof(Profile)),
    organizer: Profile_Record.pipe(z.instanceof(Profile)),
  }),
)
  .transform(({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Deal.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  })
  .describe("Maybe Deal Record");
