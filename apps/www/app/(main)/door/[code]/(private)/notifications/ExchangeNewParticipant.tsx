//

import { Avatar } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { Circle } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { select_exchange_message } from "./select_exchange_message";
import type { Notification } from "./type";

//

export function ExchangeNewParticipant({
  notification,
}: {
  notification: Notification;
}) {
  const { base, body, avatar } = card();
  const { id, created_at, read_at } = notification;
  const exchange_message = select_exchange_message(notification);
  if (!exchange_message) return null;

  const {
    exchange_id,
    exchange: { title },
    message: {
      author: { name, id: profile_id, image },
      thread_id,
    },
  } = exchange_message;
  return (
    <Link id={id} href={`/@~/exchanges/inbox/${exchange_id}/${thread_id}`}>
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div
          className={body({ className: "flex items-center justify-between" })}
        >
          <div className="flex items-center gap-1">
            <Avatar className={avatar()} image={image} id={profile_id} />
            <b className="ml-2">{name}</b>souhaite participer à votre échange
            <i>“{title}”</i>
          </div>
          <div>
            <div className="flex gap-4">
              {!read_at && (
                <div>
                  <Circle className="size-4 text-[#FF5F5F]" />
                </div>
              )}
              <time
                className="float-right text-xs text-gray-500"
                dateTime={created_at.toUTCString()}
                title={created_at.toUTCString()}
              >
                {format(created_at, "Pp", { locale: fr })}
              </time>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
