//

import { card } from "@1.ui/react/card/atom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import type { Notification } from "./type";

//

export function InboxNewMessage({
  notification,
}: {
  notification: Notification;
}) {
  const { base, body } = card();
  const { id, created_at, read_at, inbox_message } = notification;

  if (!inbox_message) return null;
  if (!inbox_message.message) return null;

  const {
    message: {
      author: { name },
      thread_id,
    },
  } = inbox_message;
  return (
    <Link id={id} href={`/@~/inbox/${thread_id}`}>
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
          <b>{name}</b> vous a envoyé un nouveau message
        </div>
      </div>
    </Link>
  );
}
