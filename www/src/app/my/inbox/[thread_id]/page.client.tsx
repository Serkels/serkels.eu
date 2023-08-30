"use client";

import { useCallback } from "react";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { Conversation_Form } from "~/components/Conversation/Conversation_Form";
import { Conversation_Timeline } from "~/components/Conversation/Conversation_Timeline";
import { useInboxMessage_controller } from "~/modules/inbox";
import { Thread_ValueProvider, useThread_Value } from "./Thread.context";

//

export const Thread_Provider = Thread_ValueProvider;

export function Thread_Avatar() {
  const [thread] = useThread_Value();
  if (!thread) return null;

  //

  return <Avatar_Show_Profile profile={thread.profile} />;
}

export function Thread_Conversation() {
  const [thread] = useThread_Value();

  const {
    list: { useQuery },
  } = useInboxMessage_controller(thread?.get("id"));
  const query_info = useQuery({ pagination: { pageSize: 1 } });

  //

  if (!thread) return null;
  return <Conversation_Timeline query_info={query_info} />;
}

export function Thread_Conversation_Form() {
  const [thread] = useThread_Value();

  const {
    create: { useMutation },
  } = useInboxMessage_controller(thread?.get("id"));
  const { mutateAsync } = useMutation();

  const send_message = useCallback(
    async (message: string) => {
      await mutateAsync(message);
    },
    [mutateAsync],
  );

  //

  if (!thread) return null;
  return <Conversation_Form send_message={send_message} />;
}
