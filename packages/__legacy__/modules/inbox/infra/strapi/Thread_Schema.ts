//

import { z } from "zod";
import { StrapiEntity, z_strapi_entity } from "../../../common";
import { Thread_PropsSchema } from "../../domain";

//

export const Thread_RecordSchema = StrapiEntity(Thread_PropsSchema)
  // .transform(
  //   z
  //     .object({
  //       participants: z.object({
  //         data: Profile_RecordSchema.array(),
  //       }),
  //       last_message: z_strapi_entity_data(Message_Schema).optional(),
  //       updatedAt: z.coerce.date(),
  //     })
  //     .passthrough().parse,
  // )
  //   .transform(Thread_PropsSchema.parse)
  //   .transform(Thread.create)
  //   .transform((result) => {
  //     return result.isOk() ? result.value() : Thread.zero;
  //   })
  .describe("Thread_RecordSchema");

export type Thread_Schema = z.TypeOf<typeof Thread_PropsSchema>;

export const Thread_DataSchema = z_strapi_entity(Thread_PropsSchema);
export type Thread_DataSchema = z.TypeOf<typeof Thread_DataSchema>;
