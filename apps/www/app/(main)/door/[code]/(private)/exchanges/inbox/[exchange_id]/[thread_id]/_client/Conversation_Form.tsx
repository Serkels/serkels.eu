"use client";

import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import { is_active_exchange } from "@1.modules/exchange.domain";
import { useExchange } from "@1.modules/exchange.ui/context";
import {
  message_form_resolver,
  MessageForm,
} from "@1.modules/inbox.ui/conversation/MessageForm";
import { Button } from "@1.ui/react/button";
import { sendGAEvent } from "@next/third-parties/google";
import { useUpdateEffect } from "@react-hookz/web";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StateMessageOutlet } from "./StateMessageOutlet";

//

export default function Conversation_Form({
  thread_id,
  recipient_id,
}: Params & { recipient_id: string }) {
  const exchange = useExchange();
  const is_active = is_active_exchange(exchange);
  const send_message = TRPC_React.inbox.thread.send.useMutation();
  const utils = TRPC_React.useUtils();
  const blacklist_item = TRPC_React.legacy_profile.me.blacklist.find.useQuery({
    profile_id: recipient_id,
  });
  const form = useForm({
    resolver: message_form_resolver,
  });
  const invalidate = () =>
    Promise.all([
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.inbox.thread.messages.invalidate({ thread_id }),
    ]);
  const on_submit = async (content: string) => {
    await send_message.mutateAsync({ content, thread_id });
    sendGAEvent("event", "send_message", {
      event_category: "exchange",
      event_label: "conversation",
      value: recipient_id,
    });

    await invalidate();
  };
  const is_blacklisted = blacklist_item.data?.profile.id === recipient_id;
  const is_disabled = Boolean(is_blacklisted) || !is_active;
  const {
    formState: { isSubmitting, isLoading },
  } = form;

  return (
    <FormProvider {...form}>
      <section className="w-full">
        <MessageForm onSubmit={on_submit} isDisabled={is_disabled} />
        <ActionButtonGroup
          isDisabled={is_disabled || isSubmitting || isLoading}
          thread_id={thread_id}
        />
        <StateMessageOutlet thread_id={thread_id} hidden={is_disabled} />
      </section>
    </FormProvider>
  );
}

//

function ActionButtonGroup({
  isDisabled,
  thread_id,
}: Params & { isDisabled: boolean }) {
  const { id: exchange_id } = useExchange();
  const utils = TRPC_React.useUtils();
  const action = TRPC_React.exchanges.me.inbox.action.useMutation();
  const next_actions_query =
    TRPC_React.exchanges.me.inbox.next_actions.useQuery({
      exchange_id,
      thread_id,
    });
  const next_actions = next_actions_query.data ?? {
    can_approuve: false,
    can_denie: false,
  };

  const inbox_query =
    TRPC_React.exchanges.me.inbox.by_thread_id.useQuery(thread_id);
  useUpdateEffect(() => {
    utils.exchanges.me.inbox.next_actions.invalidate({ thread_id });
  }, [inbox_query.dataUpdatedAt]);

  const invalidate = () =>
    Promise.all([
      utils.exchanges.by_id.invalidate(exchange_id),
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.inbox.thread.messages.invalidate({ thread_id }),
      utils.exchanges.me.inbox.next_actions.invalidate({
        exchange_id,
        thread_id,
      }),
    ]);

  const send_okay = useCallback(async () => {
    await action.mutateAsync({
      action: "APPROVE",
      exchange_id,
      thread_id,
    });

    sendGAEvent("event", "awnser", {
      event_category: "exchange",
      event_label: "approve",
      value: thread_id,
    });

    await invalidate();
  }, [exchange_id, thread_id]);

  const send_nope = useCallback(async () => {
    await action.mutateAsync({
      action: "DENIE",
      exchange_id,
      thread_id,
    });
    sendGAEvent("event", "awnser", {
      event_category: "exchange",
      event_label: "denie",
      value: thread_id,
    });
    await invalidate();
  }, [exchange_id, thread_id]);

  return (
    <div className="mb-2 mt-5 flex justify-center space-x-5">
      <Button
        intent="warning"
        isDisabled={isDisabled || action.isLoading || !next_actions.can_denie}
        onPress={send_nope}
      >
        Indisponible
      </Button>
      <Button
        isDisabled={
          isDisabled || action.isLoading || !next_actions.can_approuve
        }
        onPress={send_okay}
      >
        Accepter
      </Button>
    </div>
  );
}
