"use client";

import { TRPC_React } from ":trpc/client";
import {
  message_form_resolver,
  MessageForm,
} from "@1.modules/inbox.ui/conversation/MessageForm";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

//

export function Form({
  recipient_profile_id,
}: {
  recipient_profile_id: string;
}) {
  const send_message = TRPC_React.inbox.thread.send.useMutation();
  const router = useRouter();
  const talk_to = TRPC_React.inbox.talk_to.useMutation();
  const utils = TRPC_React.useUtils();

  const on_submit = async (content: string) => {
    const { thread_id } = await talk_to.mutateAsync(recipient_profile_id);

    await send_message.mutateAsync({ content, thread_id });
    sendGAEvent("event", "start_conversation", {
      event_category: "inbox",
      event_label: "write_to",
      value: recipient_profile_id,
    });

    await utils.inbox.find.invalidate();
    router.push(`/@~/inbox/${thread_id}`);
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
