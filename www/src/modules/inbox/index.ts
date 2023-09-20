//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { useInject } from "~/core/react";
import { Inbox_Controller } from "./inbox.controller";
import { Inbox_Repository } from "./inbox.repository";
import { Inbox_Message_Controller } from "./inbox_message.controller";
import { Inbox_Message_Repository } from "./inbox_message.repository";

//

export function useInboxMessage_repository(id: number | undefined) {
  const { data: session } = useSession();

  return useMemo(
    () =>
      new Inbox_Message_Repository(fromClient, session?.user?.jwt, Number(id)),
    [session?.user?.jwt, id],
  );
}

export function useInboxMessage_controller(id: number | undefined) {
  const repository = useInboxMessage_repository(id);

  return useMemo(() => new Inbox_Message_Controller(repository), [repository]);
}

export function useInbox_controller() {
  const repository = useInject(Inbox_Repository);
  return useMemo(() => new Inbox_Controller(repository), [repository]);
}
