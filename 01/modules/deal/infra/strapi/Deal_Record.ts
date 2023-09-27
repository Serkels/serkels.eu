//

import { StrapiEntity } from "../../../common";
import { Exchange_Record } from "../../../exchange/infra/strapi";
import { Profile_Record } from "../../../profile/infra/strapi";
import { Deal, Deal_PropsSchema } from "../../domain";

//

export const Deal_Record = StrapiEntity(
  Deal_PropsSchema.augment({
    exchange: Exchange_Record,
    participant_profile: Profile_Record,
    organizer: Profile_Record,
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

/*export const Deal_Record = StrapiEntity.pipe(
  Deal_PropsSchema.merge(
    z.object({
      exchange: StrapiEntity.pipe(
        Exchange_PropsSchema.omit({ category: true, profile: true })
          .transform(Exchange.create)
          .transform((result) => {
            return result.isOk() ? result.value() : z.NEVER;
          }),
      ).transform(function debug(value) {
        console.log("Deal_Record value=", value);
        return value;
      }),
      // category: Category_Record.pipe(z.instanceof(Category)),
      // in_exchange_of: Category_Record,
      // profile: Profile_RecordSchema.catch(Profile.zero),
    }),
  )
    .transform(Deal.create)
    .refine((result) => result.isOk())
    .transform((result) => {
      return result.isOk() ? result.value() : z.NEVER;
    })
    .describe("Maybe Deal Record")
    .optional(),
);
/*
export const Deal_Record = StrapiEntity.pipe(
  Deal_PropsSchema.merge(
    z.object({
      exchange: StrapiEntity.pipe(
        Exchange_PropsSchema.merge(
          z.object({
            category: Category_Record.catch(Category.unknown),
            in_exchange_of: Category_Record.catch(Category.unknown),
            profile: Profile_RecordSchema.default(Profile.zero),
          }),
        )
          .pipe(Exchange_PropsSchema)
          .transform(Exchange.create)
          .transform((result) => {
            return result.isOk() ? result.value() : Exchange.zero;
          }),
      ),
      // organizer: z.any(),
      // participant_profile: z.any(),
      // status: z.any(),
      // exchange: Exchange_PropsSchema.merge(
      //   z.object({
      //     category: Category_Record,
      //     in_exchange_of: Category_Record,
      //     profile: Profile_RecordSchema.catch(Profile.zero),
      //   }),
      // ),
      // organizer: Profile_RecordSchema,
      // participant_profile: Profile_RecordSchema,
    }),
  ),
)
  .transform((result) => {
    console.log("deal/infra/strapi/Deal_Record.ts", { result });
    return result;
  })
  // .pipe(Deal_PropsSchema)
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
  .describe("Deal_Record");

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
*/
