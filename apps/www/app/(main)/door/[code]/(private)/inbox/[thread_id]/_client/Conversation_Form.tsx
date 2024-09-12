"use client";

import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import {
  message_form_resolver,
  MessageForm,
} from "@1.modules/inbox.ui/conversation/MessageForm";
import { FormProvider, useForm } from "react-hook-form";

//

export default function Conversation_Form({ thread_id }: Params) {
  const { mutateAsync } = TRPC_React.inbox.thread.send.useMutation();
  const utils = TRPC_React.useUtils();

  const on_submit = async (content: string) => {
    await mutateAsync({ content, thread_id });
    await utils.inbox.thread.messages.invalidate({ thread_id });
    await utils.inbox.find.invalidate();
  };

  const form = useForm({
    resolver: message_form_resolver,
  });
  return (
    <FormProvider {...form}>
      <MessageForm onSubmit={on_submit} />
    </FormProvider>
  );
}
