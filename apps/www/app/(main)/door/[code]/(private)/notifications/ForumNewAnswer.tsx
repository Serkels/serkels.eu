//

import { TRPC_React } from ":trpc/client";
import { Avatar } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { Circle } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useCallback } from "react";
import type { Notification } from "./type";

//

export function ForumNewAnswer({
  notification,
}: {
  notification: Notification;
}) {
  const { forum_message, mark_as_read, href_searhparams } = context({
    notification,
  });
  const { base, body, avatar } = card();
  //

  const { id, created_at, read_at } = notification;
  const {
    answer: {
      owner: {
        profile: { name, image },
        profile_id,
      },
      parent: { title },
    },
  } = forum_message;

  return (
    <Link
      id={id}
      href={{
        pathname: "/forum",
        search: href_searhparams.toString(),
      }}
      onClick={mark_as_read}
    >
      <div
        className={base({ className: read_at ? "bg-transparent" : "bg-white" })}
      >
        <div
          className={body({ className: "flex items-center justify-between" })}
        >
          <div className="flex items-center gap-1">
            <Avatar className={avatar()} image={image} id={profile_id} />
            <b className="ml-2">{name}</b> a répondu à votre question{" "}
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

function context({ notification }: { notification: Notification }) {
  const utils = TRPC_React.useUtils();
  const { id } = notification;
  const forum_message = select_forum_new_answer(notification);
  if (!forum_message) throw new Error("forum_message is null");

  const mark_as_read_mut = TRPC_React.notification.mark_as_read.useMutation();
  const mark_as_read = useCallback(async () => {
    await mark_as_read_mut.mutate({ notification_id: id });
    await utils.notification.count_unread.invalidate();
  }, [id, mark_as_read_mut]);

  const href_searhparams = new URLSearchParams({
    q: forum_message.answer.parent.title,
    since: forum_message.answer.parent.id,
  });

  return {
    forum_message,
    href_searhparams,
    mark_as_read,
    notification,
  };
}

function select_forum_new_answer({ forum_message }: Notification) {
  if (!forum_message) return null;
  if (!forum_message.answer) return null;
  if (!forum_message.answer_id) return null;

  return {
    answer_id: forum_message.answer_id,
    answer: forum_message.answer,
  };
}
