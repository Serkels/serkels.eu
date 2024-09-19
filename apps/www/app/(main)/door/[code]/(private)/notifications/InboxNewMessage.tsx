//

import { Avatar } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { Circle } from "@1.ui/react/icons";
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
  const { base, body, avatar } = card();
  const { id, created_at, read_at, inbox_message } = notification;

  if (!inbox_message) return null;
  if (!inbox_message.message) return null;

  const {
    message: {
      author: { name, id: profile_id, image },
      thread_id,
    },
  } = inbox_message;
  return (
    <Link id={id} href={`/@~/inbox/${thread_id}`}>
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div className="flex items-center justify-between ">
          <div
            className={body({
              className: `flex items-center gap-1 space-x-2`,
            })}
          >
            <Avatar className={avatar()} image={image} id={profile_id} />
            <b>{name}</b> vous a envoyé un nouveau message
          </div>
          <div>
            <div className="flex gap-4">
              {!read_at && (
                <div>
                  <Circle className="size-4 text-[#FF5F5F]" />
                </div>
              )}
              <time
                className="float-right px-5 text-xs text-gray-500"
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
