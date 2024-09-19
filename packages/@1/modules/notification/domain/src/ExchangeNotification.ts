//

import { Exchange_Schema } from "@1.modules/exchange.domain";
import { AvatarProfile_Entity } from "@1.modules/profile.domain";
import { z } from "zod";
import { NotificationEntity } from "./Notification";

//

export const ExchangeNotificationEntity = NotificationEntity.extend({
  exchange_message: z.object({
    exchange: Exchange_Schema.pick({ id: true, title: true }).extend({
      owner: z.object({
        profile: AvatarProfile_Entity,
      }),
    }),
    message: z.object({
      author: z.object({ name: z.string(), image: z.string() }),
      thread_id: z.string(),
    }),
  }),
});

export type ExchangeNotification = z.TypeOf<typeof ExchangeNotificationEntity>;
