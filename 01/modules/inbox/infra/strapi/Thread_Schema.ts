//

import { z } from "zod";
import {
  StrapiEntity,
  z_strapi_entity,
  z_strapi_entity_data,
} from "../../../common";
import { Profile_RecordSchema } from "../../../profile/infra/strapi";
import { Thread, Thread_PropsSchema } from "../../domain";
import { Message_Schema } from "./Message_Schema";

//

export const Thread_RecordSchema = StrapiEntity.transform(
  z
    .object({
      participants: z.object({
        data: Profile_RecordSchema.array(),
      }),
      last_message: z_strapi_entity_data(Message_Schema).optional(),
      updatedAt: z.coerce.date(),
    })
    .passthrough().parse,
)
  .transform(Thread_PropsSchema.parse)
  .transform(Thread.create)
  .transform((result) => {
    return result.isOk() ? result.value() : Thread.zero;
  })
  .describe("Thread_RecordSchema");

export type Thread_Schema = z.TypeOf<typeof Thread_PropsSchema>;

export const Thread_DataSchema = z_strapi_entity(Thread_PropsSchema);
export type Thread_DataSchema = z.TypeOf<typeof Thread_DataSchema>;
