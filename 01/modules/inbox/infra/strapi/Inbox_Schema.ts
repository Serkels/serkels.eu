//

import { z } from "zod";
import { z_strapi_flatten_page_data } from "../../../common";
import { Inbox, Inbox_PropsSchema } from "../../domain";
import { Thread_RecordSchema } from "./Thread_Schema";

//

export const Inbox_Record = z
  .object({
    id: z.number().optional(),
    thread: Thread_RecordSchema,
    updatedAt: z.coerce.date(),
  })

  .transform(Inbox_PropsSchema.parse)
  .transform(Inbox.create)
  .transform((result) => {
    return result.isOk() ? result.value() : Inbox.zero;
  })
  .describe("Inbox_Schema");

//

export const InboxList_Schema = z_strapi_flatten_page_data(Inbox_Record);

export type InboxList_Schema = z.TypeOf<typeof InboxList_Schema>;
