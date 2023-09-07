"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { Conversation_Form } from "~/components/Conversation/Conversation_Form";
import { Conversation_Timeline } from "~/components/Conversation/Conversation_Timeline";
import { ErrorOccur } from "~/components/ErrorOccur";
import {
  useInboxMessage_controller,
  useInbox_controller,
} from "~/modules/inbox";
import { Inbox_QueryKeys } from "~/modules/inbox/query_keys";
import { Inbox_ValueProvider, useInbox_Value } from "./Inbox.context";
import { Thread_ValueProvider, useThread_Value } from "./Thread.context";

//

export const Thread_Provider = Thread_ValueProvider;
export const Inbox_Provider = Inbox_ValueProvider;

export function Inbox({ children, id }: PropsWithChildren<{ id: number }>) {
  const {
    by_id: { useQuery },
  } = useInbox_controller();
  const { inbox, info } = useQuery(id);
  const [, set_thread] = useThread_Value();
  const [, set_inbox] = useInbox_Value();

  useEffect(() => {
    set_inbox(inbox);
    set_thread(inbox?.get("thread"));
  }, [inbox]);

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => (
      <div className="mt-24">
        <ErrorOccur error={error as Error} />
      </div>
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, ({}) => children)
    .exhaustive();
}

export function Thread_Avatar() {
  const [thread] = useThread_Value();
  if (!thread) return null;

  //

  return <Avatar_Show_Profile profile={thread.profile} />;
}

export function Thread_Conversation() {
  const [inbox] = useInbox_Value();

  const {
    list: { useQuery },
  } = useInboxMessage_controller(inbox?.get("id"));
  const query_info = useQuery({ pagination: { pageSize: 22 } });

  //

  if (!inbox) return null;
  return <Conversation_Timeline query_info={query_info} />;
}

export function Thread_Conversation_Form() {
  const [inbox] = useInbox_Value();
  const query_client = useQueryClient();
  const inbox_id = Number(inbox?.get("id"));
  const {
    create: { useMutation },
  } = useInboxMessage_controller(inbox_id);
  const { mutateAsync } = useMutation();

  const send_message = useCallback(
    async (message: string) => {
      await mutateAsync(message);

      query_client.invalidateQueries(Inbox_QueryKeys.item(inbox_id));
    },
    [mutateAsync, inbox_id],
  );

  //

  if (!inbox) return null;
  return <Conversation_Form send_message={send_message} />;
}

function Loading() {
  return (
    <figure className=" mt-28 text-center">
      <Spinner />
    </figure>
  );
}
