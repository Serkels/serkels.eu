//

import { format_date_time } from "@1.modules/core/date";
import type { ProfileNotification } from "@1.modules/notification.domain";
import { Avatar } from "@1.ui/react/avatar";
import { Circle } from "@1.ui/react/icons";
import { card_notification } from "./atom";
//

export function ProfileAdded({
  notification,
}: {
  notification: ProfileNotification;
}) {
  const {
    created_at,
    read_at,
    profile_added: {
      profile: { id: profile_id, name, image },
    },
  } = notification;
  const { avatar, base, body, time } = card_notification({
    is_read: Boolean(read_at),
  });
  return (
    <div className={base()}>
      <div
        className={body({
          className: `flex items-center justify-between gap-1 space-x-2`,
        })}
      >
        <div className="flex items-center gap-1">
          <Avatar className={avatar()} image={image} id={profile_id} />
          <b className="ml-2">{name}</b> vous a ajouté dans son cercle.
        </div>
        <div className="flex gap-4">
          {!read_at && (
            <div>
              <Circle className="size-4 text-[#FF5F5F]" />
            </div>
          )}
          <time
            className={time()}
            dateTime={created_at.toUTCString()}
            title={created_at.toUTCString()}
          >
            {format_date_time(created_at)}
          </time>
        </div>
      </div>
    </div>
  );
}
