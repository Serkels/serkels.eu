"use client";

import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import { useExchange } from "@1.modules/exchange.ui/context";
import { Button } from "@1.ui/react/button";
import { useEnterToSubmit } from "@1.ui/react/form";
import { SendButton } from "@1.ui/react/form/SendButton";
import { input } from "@1.ui/react/form/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEffect } from "@react-hookz/web";
import { useCallback, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StateMessageOutlet } from "./StateMessageOutlet";

//

export default function Conversation_Form({ thread_id }: Params) {
  const {
    form: {
      formState: { isSubmitting, isLoading },
      register,
    },
    on_submit,
  } = use_form({ thread_id });
  return (
    <section className="w-full">
      <form className="relative" onSubmit={on_submit}>
        <textarea
          {...register("message")}
          autoComplete="off"
          className={input({
            className: `
              peer
              max-h-32
              min-h-16
              w-full
              resize-none
              rounded-2xl
              pr-14
            `,
          })}
          readOnly={isSubmitting}
          placeholder="Envoie un Message…"
        ></textarea>
        <SendButton isSubmitting={isSubmitting} />
      </form>
      <ActionButtonGroup
        isDisabled={isSubmitting || isLoading}
        thread_id={thread_id}
      />
      <StateMessageOutlet thread_id={thread_id} />
    </section>
  );
}

//

const form_zod_schema = z.object({
  message: z.string().trim().min(1),
});
type FormValues = z.infer<typeof form_zod_schema>;

function use_form({ thread_id }: Params) {
  const form = useForm<FormValues>({
    resolver: zodResolver(form_zod_schema),
  });
  const send_message = TRPC_React.inbox.thread.send.useMutation();
  const utils = TRPC_React.useUtils();

  const invalidate = () =>
    Promise.all([
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.inbox.thread.messages.invalidate({ thread_id }),
    ]);

  const on_submit = form.handleSubmit(async ({ message: content }) => {
    await send_message.mutateAsync({ content, thread_id });
    form.setValue("message", "");
    form.setFocus("message");
    await invalidate();
  });

  useEnterToSubmit({
    is_submitting: form.formState.isSubmitting,
    on_submit,
  });

  useLayoutEffect(() => {
    form.setFocus("message");
  }, [form.setFocus]);

  return { form, on_submit };
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
    await invalidate();
  }, [exchange_id, thread_id]);

  const send_nope = useCallback(async () => {
    await action.mutateAsync({
      action: "DENIE",
      exchange_id,
      thread_id,
    });
    await invalidate();
  }, [exchange_id, thread_id]);

  return (
    <div className="mb-2 mt-5 flex justify-center space-x-5">
      <Button
        intent="warning"
        isDisabled={isDisabled || !next_actions.can_denie}
        onPress={send_nope}
      >
        Indisponible
      </Button>
      <Button
        isDisabled={isDisabled || !next_actions.can_approuve}
        onPress={send_okay}
      >
        Accepter
      </Button>
    </div>
  );
}
