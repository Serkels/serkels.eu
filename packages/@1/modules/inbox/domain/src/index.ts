//

import { Entity_Schema, Entity_Timestamps } from "@1.modules/core/domain";
import { Profile_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Message_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    id: z.string(),
    content: z.string(),
    author: Profile_Schema.omit({ bio: true }),
  })
  .describe("Message_Schema");

export interface Message extends z.TypeOf<typeof Message_Schema> {}

//

export const Thread_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    messages: z.array(Message_Schema),
    participants: z.array(Profile_Schema.omit({ bio: true, role: true })),
  })
  .describe("Thread_Schema");

export interface Thread extends z.TypeOf<typeof Thread_Schema> {}

//

export const Inbox_Schema = Entity_Schema.extend({
  thread: Thread_Schema,
  last_seen_date: z.date(),
  is_archived: z.boolean(),
}).describe("Inbox_PropsSchema");

export interface Inbox extends z.TypeOf<typeof Inbox_Schema> {}
