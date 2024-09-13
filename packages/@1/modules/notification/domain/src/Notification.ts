//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const NotificationEntity = Entity_Schema.extend({
  read_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
});

export type Notification = z.TypeOf<typeof NotificationEntity>;
