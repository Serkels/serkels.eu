//

import { AvatarProfile_Entity } from "@1.modules/profile.domain";
import { z } from "zod";
import { NotificationEntity } from "./Notification";

//

export const ProfileNotificationEntity = NotificationEntity.extend({
  profile_added: z.object({
    profile: AvatarProfile_Entity,
  }),
});

export type ProfileNotification = z.TypeOf<typeof ProfileNotificationEntity>;
