//

import { format_date_time } from "@1.modules/core/date";
import type { ID_Schema } from "@1.modules/core/domain";
import type { ExchangeNotification } from "@1.modules/notification.domain";
import { Avatar } from "@1.ui/react/avatar";
import { Circle } from "@1.ui/react/icons";
import Link from "next/link";
import { card_notification } from "./atom";

//

export function ExchangeNewMessage({
  notification,
  profile,
}: {
  notification: ExchangeNotification;
  profile: { id: ID_Schema };
}) {
  const { id: my_profile_id } = profile;
  const { id, created_at, read_at, exchange_message } = notification;
  const { avatar, base, body, time } = card_notification({
    is_read: Boolean(read_at),
  });

  const {
    exchange: {
      id: exchange_id,
      owner: {
        profile: { id: profile_id },
      },
      title,
    },
    message: {
      author: { name, image },
      thread_id,
    },
  } = exchange_message;
  const is_my_exchange = my_profile_id === profile_id;

  return (
    <Link id={id} href={`/@~/exchanges/inbox/${exchange_id}/${thread_id}`}>
      <div className={base()}>
        <div
          className={body({
            className: `flex items-center justify-between gap-1 space-x-2`,
          })}
        >
          <div className="flex items-center gap-1">
            <Avatar className={avatar()} image={image} id={profile_id} />
            <b className="ml-2">{name}</b> a envoyé un nouveau message sur{" "}
            {is_my_exchange ? "votre " : "l'"}échange <i>“{title}”</i>
          </div>
          <div>
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
      </div>
    </Link>
  );
}
