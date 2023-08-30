//

import { z } from "zod";
import {
  z_strapi_collection,
  z_strapi_entity,
  z_strapi_entity_data,
} from "../../../common";
import { Profile_Schema } from "../../../profile/infra/strapi";
import { Message_Schema } from "./Message_Schema";

//

export const Thread_Schema = z.object({
  participants: z_strapi_collection(Profile_Schema),
  last_message: z_strapi_entity_data(Message_Schema).optional(),
  updatedAt: z.coerce.date(),
});

export type Thread_Schema = z.TypeOf<typeof Thread_Schema>;

export const Thread_DataSchema = z_strapi_entity(Thread_Schema);
export type Thread_DataSchema = z.TypeOf<typeof Thread_DataSchema>;
