"use client";

import { useInject } from "@1/next-tsyringe";
import { Spinner } from "@1/ui/components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { Conversation_Form } from "~/components/Conversation/Conversation_Form";
import { Conversation_Timeline } from "~/components/Conversation/Conversation_Timeline";
import { useInboxMessage_controller } from "~/modules/inbox";
import { Get_Inbox_ById_UseCase } from "~/modules/inbox/application/get_inbox_byid.use-case";
import { Inbox_QueryKeys } from "~/modules/inbox/query_keys";
import { Inbox_ValueProvider, useInbox_Value } from "./Inbox.context";
import { Thread_ValueProvider, useThread_Value } from "./Thread.context";

//

export const Thread_Provider = Thread_ValueProvider;
export const Inbox_Provider = Inbox_ValueProvider;

export function Inbox({ children, id }: PropsWithChildren<{ id: number }>) {
  const info = useInject(Get_Inbox_ById_UseCase).execute(id);
  const { data: inbox } = info;
  const [, set_thread] = useThread_Value();
  const [, set_inbox] = useInbox_Value();

  useEffect(() => {
    set_inbox(inbox);
    set_thread(inbox?.get("thread"));
  }, [inbox?.id.value()]);
  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => children)
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
  } = useInboxMessage_controller(Number(inbox?.id.value()));
  const query_info = useQuery({ pagination: { pageSize: 22 } });

  //

  if (!inbox) return null;
  return <Conversation_Timeline query_info={query_info} />;
}

export function Thread_Conversation_Form() {
  const [inbox] = useInbox_Value();
  const query_client = useQueryClient();
  const inbox_id = Number(inbox?.id.value());
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
