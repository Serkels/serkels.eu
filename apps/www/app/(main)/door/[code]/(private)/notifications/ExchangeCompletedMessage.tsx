//

import { TRPC_React } from ":trpc/client";
import { card } from "@1.ui/react/card/atom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { select_exchange_message } from "./select_exchange_message";
import type { Notification } from "./type";

//

export function ExchangeCompletedMessage({
  notification,
}: {
  notification: Notification;
}) {
  const route = useRouter();
  const session = useSession();
  const utils = TRPC_React.useUtils();
  if (!session.data) return null;
  const {
    data: {
      profile: { id: my_profile_id },
    },
  } = session;
  const { base, body } = card();
  const { id, created_at, read_at } = notification;
  const exchange_message = select_exchange_message(notification);
  if (!exchange_message) return null;

  const {
    exchange_id,
    exchange: {
      owner: { profile_id },
      title,
    },
  } = exchange_message;
  const is_my_exchange = my_profile_id === profile_id;

  const mark_as_read_mut = TRPC_React.notification.mark_as_read.useMutation();
  const mark_as_read = useCallback(async () => {
    await mark_as_read_mut.mutate({ notification_id: id });
    await utils.notification.count_unread.invalidate();
    await route.push(`/@~/history/?since=${exchange_id}`);
  }, [id, mark_as_read_mut]);

  //

  return (
    <div id={id} onClick={mark_as_read}>
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
          <b>Félicitation !</b>{" "}
          {is_my_exchange ? (
            <>
              Votre annonce d'échange <i>“{title}”</i> est complète.
            </>
          ) : (
            <>
              L'échange <i>“{title}”</i> auquel vous participez est désormais complet.
            </>
          )}
          <>Bon échange et à bientôt !</>
        </div>
      </div>
    </div>
  );
}
