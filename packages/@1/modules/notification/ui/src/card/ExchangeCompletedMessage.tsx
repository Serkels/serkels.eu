//

import { format_date_time } from "@1.modules/core/date";
import type { ID_Schema } from "@1.modules/core/domain";
import type { ExchangeNotification } from "@1.modules/notification.domain";
import { Avatar } from "@1.ui/react/avatar";
import { Circle } from "@1.ui/react/icons";
import { card_notification } from "./atom";

//

export function ExchangeCompletedMessage({
  notification,
  profile,
}: {
  notification: ExchangeNotification;
  profile: { id: ID_Schema };
}) {
  const { created_at, read_at } = notification;
  const { id: my_profile_id } = profile;
  const { avatar, base, body, time } = card_notification({
    is_read: Boolean(read_at),
  });

  const {
    exchange_message: {
      exchange: {
        owner: {
          profile: { id: profile_id, image },
        },
        title,
      },
    },
  } = notification;
  const is_my_exchange = my_profile_id === profile_id;

  //

  return (
    <div className={base()}>
      <div className={body({ className: "flex items-center justify-between" })}>
        <div className="flex items-center gap-2">
          <Avatar className={avatar()} image={image} id={profile_id} />
          <b className="ml-2">Félicitation !</b>
          {is_my_exchange ? (
            <div>
              Votre annonce d'échange <i>“{title}”</i> est complète.
            </div>
          ) : (
            <div>
              L'échange <i>“{title}”</i> auquel vous participez est désormais
              complet.
            </div>
          )}
          <>Bon échange et à bientôt !</>
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
