//

import { Entity_Schema, ID_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Notification_Base = Entity_Schema.extend({
  read_at: z.coerce.date().optional(),
  created_at: z.coerce.date(),
}).describe("Notification_Base");

export const NotificationGroup = z.enum(["EXCHANGE", "INBOX"]);

//

export const inbox_new_message = z
  .object({
    sender_id: ID_Schema,
    thread_id: ID_Schema,
  })
  .describe("inbox_new_message");

export type Inbox_New_Message = z.TypeOf<typeof inbox_new_message>;
