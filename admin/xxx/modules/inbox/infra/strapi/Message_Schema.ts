//

import { z } from "zod";
import { Profile_Schema } from "../../../profile/infra/strapi";

//

export const Message_Schema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  author: Profile_Schema,
});

export type Message_Schema = z.TypeOf<typeof Message_Schema>;

//

export const MessageList_Schema = z.object({
  data: z.array(Message_Schema),
  meta: z.any(),
});

export type MessageList_Schema = z.TypeOf<typeof MessageList_Schema>;
