//

import { z } from "zod";
import { z_strapi_entity, z_strapi_entity_data } from "../../../common";
import { Profile_Schema } from "../../../profile/infra/strapi";

//

export const Message_Schema = z.object({
  id: z.number().optional(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  author: z_strapi_entity_data(Profile_Schema).optional(),
});

export type Message_Schema = z.TypeOf<typeof Message_Schema>;

export const Message_DataSchema = z_strapi_entity(Message_Schema);

export type Message_DataSchema = z.TypeOf<typeof Message_DataSchema>;

//

export const MessageList_Schema = z.object({
  data: z.array(Message_Schema),
  meta: z.any(),
});

export type MessageList_Schema = z.TypeOf<typeof MessageList_Schema>;
