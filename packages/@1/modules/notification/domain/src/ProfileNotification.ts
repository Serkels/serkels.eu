//

import { z } from "zod";
import { NotificationEntity } from "./Notification";

//

export const ProfileNotificationEntity = NotificationEntity.extend({
  profile_added: z.object({
    profile: z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
    }),
  }),
});

export type ProfileNotification = z.TypeOf<typeof ProfileNotificationEntity>;
