//

import { Entity_Schema, ID_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Notification_Base = Entity_Schema.extend({
  read_at: z.coerce.date().optional(),
  created_at: z.coerce.date(),
}).describe("Notification_Base");

export const Notification_InboxNewMessage = Notification_Base.extend({
  type: z.literal("INBOX_NEW_MESSAGE"),
  inbox_message: z.object({ message: z.object({ thread_id: ID_Schema }) }),
}).describe("Notification_PropsSchema");

export interface Notification_InboxNewMessage
  extends z.TypeOf<typeof Notification_InboxNewMessage> {}

export type Notification = Notification_InboxNewMessage;

//

export const inbox_new_message = z
  .object({
    sender_id: ID_Schema,
    thread_id: ID_Schema,
  })
  .describe("inbox_new_message");

export type Inbox_New_Message = z.TypeOf<typeof inbox_new_message>;
