"use client";

import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import {
  message_form_resolver,
  MessageForm,
} from "@1.modules/inbox.ui/conversation/MessageForm";
import { sendGAEvent } from "@next/third-parties/google";
import { FormProvider, useForm } from "react-hook-form";

//

export default function Conversation_Form({
  thread_id,
  recipient_id,
}: Params & { recipient_id: string }) {
  const { mutateAsync } = TRPC_React.inbox.thread.send.useMutation();
  const blacklist_item = TRPC_React.legacy_profile.me.blacklist.find.useQuery({
    profile_id: recipient_id,
  });
  const is_blacklisted = blacklist_item.data?.profile.id === recipient_id;
  const utils = TRPC_React.useUtils();

  const on_submit = async (content: string) => {
    await mutateAsync({ content, thread_id });

    sendGAEvent("event", "send_message", {
      event_category: "inbox",
      event_label: "conversation",
      value: recipient_id,
    });

    await utils.inbox.thread.messages.invalidate({ thread_id });
    await utils.inbox.find.invalidate();
  };

  const form = useForm({
    resolver: message_form_resolver,
  });
  return (
    <FormProvider {...form}>
      <MessageForm onSubmit={on_submit} isDisabled={Boolean(is_blacklisted)} />
    </FormProvider>
  );
}
