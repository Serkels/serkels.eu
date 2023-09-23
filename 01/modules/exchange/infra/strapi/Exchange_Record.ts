//

import { z } from "zod";
import { Category, Category_PropsSchema } from "../../../category/domain";
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
      in_exchange_of: StrapiEntity // z
        // .object(
        //   {
        //     data: z
        //       .object(
        //         {
        //           attributes: z.any(),
        //           id: ID_Schema,
        //         },
        //         { description: "Strapi Entity" },
        //       )
        //       .nullable()
        //       .transform(function flatten_attributes(data) {
        //         return data ? data : undefined;
        //       }),
        //   },
        //   { description: "Strapi Entity Data Maybe" },
        // )
        // .transform(function flatten_attributes({ data }) {
        //   return data ? { id: data.id, ...data.attributes } : undefined;
        // })
        // .transform(function data_entity(data) {
        //   return data.data ? { data: { id: data.data.id } } : null;
        // })
        .transform(function debug(value) {
          console.log("Exchange_RecordSchema before value=", value);
          return value;
        })
        // .pipe(
        //   z
        //     .object(
        //       {
        //         data: z
        //           .object(
        //             {
        //               attributes: z.any(),
        //               id: ID_Schema,
        //             },
        //             { description: "Strapi Entity" },
        //           )

        //           .transform(function debug(value) {
        //             console.log("Exchange_RecordSchema value=", value);
        //             return value;
        //           }),
        //       },
        //       { description: "Strapi Entity Data Maybe" },
        //     )
        //     .optional(),
        // )
        .pipe(
          Category_PropsSchema.transform(Category.create)
            .transform((result) => {
              return result.isOk() ? result.value() : Category.unknown;
            })
            .optional(),
        )
        // .pipe(z.undefined().or(Category_RecordSchema))
        .transform(function debug(value) {
          console.log("Exchange_RecordSchema after value=", value);
          return value;
        }),
      // .pipe(z.nullable(Category_RecordSchema))
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
    console.log("Exchange_RecordSchema result.value=", result.value());
    return result.isOk() ? result.value() : Exchange.zero;
  })
  .describe("Exchange_RecordSchema");
