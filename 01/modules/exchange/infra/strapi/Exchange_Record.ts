//

import { ID_Schema } from "@1/core/domain";
import { z } from "zod";
import { Category_RecordSchema } from "../../../category/infra/strapi";
import { StrapiEntity } from "../../../common";
import { Profile } from "../../../profile/domain";
import { Profile_RecordSchema } from "../../../profile/infra/strapi";
import { Exchange, Exchange_PropsSchema } from "../../domain";

//

export const Exchange_RecordSchema = StrapiEntity.pipe(
  Exchange_PropsSchema.merge(
    z.object({
      category: Category_RecordSchema.optional(), //.default(Category.unknown),
      in_exchange_of: z.object(
        {
          data: z.nullable(
            z
              .object(
                {
                  attributes: z.any(),
                  id: ID_Schema,
                },
                { description: "Strapi Entity" },
              )
              .nullable()
              .transform(function data_entity(data) {
                return { data };
              })
              .pipe(z.optional(Category_RecordSchema)),
          ),
        },
        { description: "Strapi Entity Data Maybe" },
      ),
      profile: Profile_RecordSchema.catch(Profile.zero),
    }),
  ),
)
  .pipe(Exchange_PropsSchema)
  // .transform((data) =>
  //   z
  //     .object({
  //       category: Category_RecordSchema,
  //       in_exchange_of: Category_RecordSchema,
  //       profile: Profile_RecordSchema,
  //     })
  //     .passthrough()
  //     .parse({ data }),
  // )
  .transform(Exchange.create)
  .transform((result) => {
    console.log("Exchange_RecordSchema", result.value());
    return result.isOk() ? result.value() : Exchange.zero;
  })
  .describe("Exchange_RecordSchema");
