//

import { z } from "zod";
import { Thread_Schema } from "./Thread_Schema";

//

export const Inbox_Schema = z.object({
  id: z.number(),
  thread: Thread_Schema,
  updatedAt: z.coerce.date(),
});

export type Inbox_Schema = z.TypeOf<typeof Inbox_Schema>;

//

export const InboxList_Schema = z.object({
  data: z.array(Inbox_Schema),
  meta: z.any(),
});

export type InboxList_Schema = z.TypeOf<typeof InboxList_Schema>;
