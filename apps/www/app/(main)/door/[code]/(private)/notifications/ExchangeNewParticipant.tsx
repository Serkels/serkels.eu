//

import { card } from "@1.ui/react/card/atom";
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
  const { base, body } = card();
  const { id, created_at, read_at } = notification;
  const exchange_message = select_exchange_message(notification);
  if (!exchange_message) return null;

  const {
    exchange_id,
    exchange: { title },
    message: {
      author: { name },
      thread_id,
    },
  } = exchange_message;
  return (
    <Link id={id} href={`/@~/exchanges/inbox/${exchange_id}/${thread_id}`}>
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div className={body()}>
          <time
            className="float-right text-xs text-gray-500"
            dateTime={created_at.toUTCString()}
            title={created_at.toUTCString()}
          >
            {format(created_at, "Pp", { locale: fr })}
          </time>
          <b>{name}</b> vous a envoyé une nouvelle demade à votre échange{" "}
          <i>“{title}”</i>
        </div>
      </div>
    </Link>
  );
}
