//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { Inbox_Message_Controller } from "./inbox_message.controller";
import { Inbox_Message_Repository } from "./inbox_message.repository";

//

export function useInboxMessage_repository(id: number) {
  const { data: session } = useSession();

  return useMemo(
    () => new Inbox_Message_Repository(fromClient, session?.user?.jwt, id),
    [session?.user?.jwt, id],
  );
}

export function useInboxMessage_controller(id: number) {
  const repository = useInboxMessage_repository(id);

  return useMemo(() => new Inbox_Message_Controller(repository), [repository]);
}
