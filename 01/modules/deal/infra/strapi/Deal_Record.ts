//

import { z } from "zod";
import { StrapiEntity } from "../../../common";
import { Exchange_RecordSchema } from "../../../exchange/infra/strapi";
import { Profile_RecordSchema } from "../../../profile/infra/strapi";
import { Deal, Deal_PropsSchema } from "../../domain";

//

export const Deal_RecordSchema = StrapiEntity.transform((result) => {
  console.log("deal/infra/strapi/Deal_Record.ts", { result });
  return result;
})
  .pipe(
    Deal_PropsSchema.merge(
      z.object({
        exchange: Exchange_RecordSchema,
        organizer: Profile_RecordSchema,
        participant_profile: Profile_RecordSchema,
      }),
    ),
  )
  .transform((result) => {
    console.log("deal/infra/strapi/Deal_Record.ts", { result });
    return result;
  })
  .pipe(Deal_PropsSchema)
  .transform(Deal.create)
  .transform((result) => {
    return result.isOk() ? result.value() : Deal.zero;
  })
  // .object({
  //   // exchange: Exchange_Mapper,
  //   // last_message: Message_Mapper,
  //   // profile: Profile_Mapper,
  //   organizer: Profile_Mapper,
  // })
  // .merge(Strapi_Timestamps)
  .describe("Deal_RecordSchema");

//

//

// .transform(({ data }) => {
//   if (!data)
//     throw new InputError("Deal_Mapper", {
//       errors: [new IllegalArgs("data undefined")],
//     });

//   const domain = Deal.create({
//     ...data.attributes,
//     last_message: undefined,
//     status: "idle",
//     id: data.id,
//   });

//   if (domain.isFail()) {
//     throw new InputError("Deal_Mapper", { cause: domain.error() });
//   }

//   return domain.value();
// });
