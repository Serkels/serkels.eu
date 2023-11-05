"use client";

import { TRPC_React } from ":trpc/client";
import { Deal_Status_Schema, type Exchange } from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { Field, Form, Formik } from "formik";
import { useCallback } from "react";

//

export default function Conversation_Form({
  exchange,
  thread_id,
}: {
  exchange: Exchange;
  thread_id: string;
}) {
  const exchange_id = exchange.id;
  const send = TRPC_React.inbox.thread.send.useMutation();
  const action = TRPC_React.exchanges.me.inbox.action.useMutation();
  const inbox = TRPC_React.exchanges.me.inbox.by_thread_id.useQuery(thread_id);
  const next_actions = TRPC_React.exchanges.me.inbox.next_actions.useQuery({
    exchange_id,
    thread_id,
  });
  const utils = TRPC_React.useUtils();
  const invalidate = useCallback(async () => {
    await Promise.all([
      utils.inbox.thread.messages.invalidate({ thread_id }),
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.exchanges.me.inbox.next_actions.invalidate(),
      utils.exchanges.by_id.invalidate(exchange.id),
    ]);
  }, [utils, thread_id]);
  const send_message = useCallback(
    async (content: string) => {
      await send.mutateAsync({ content, thread_id });
      await invalidate();
    },
    [send.mutateAsync, thread_id],
  );
  const send_okay = useCallback(async () => {
    await action.mutateAsync({
      action: "APPROVE",
      exchange_id,
      thread_id,
    });
    await invalidate();
  }, [thread_id]);
  const send_nope = useCallback(async () => {
    await action.mutateAsync({
      action: "DENIE",
      exchange_id,
      thread_id,
    });
    await invalidate();
  }, [thread_id]);

  const isLoading =
    send.isLoading ||
    action.isLoading ||
    exchange.deals.length >= exchange.places;
  const next = next_actions.data ?? { can_approuve: false, can_denie: false };
  if (!next_actions.data) {
    return null;
  }

  if (inbox.data?.deal.status == Deal_Status_Schema.Enum.APPROVED) {
    // TODO(douglasduteil): display congrats.
  }

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={async (value, formik) => {
        await send_message(value.message);
        formik.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-full">
          <div className="relative">
            <Field
              as="textarea"
              className={input({ className: "peer w-full rounded-2xl pr-10" })}
              placeholder="Envoie un Message…"
              autoComplete="off"
              disabled={isSubmitting || isLoading}
              name="message"
            />
            <span className="absolute inset-y-0 right-5 flex items-center pl-2">
              <Button
                intent="light"
                type="submit"
                isDisabled={isSubmitting || isLoading}
                className="focus:shadow-outline p-1 focus:outline-none"
              >
                <PaperPlane className="h-6 w-6 text-success" />
              </Button>
            </span>
          </div>
          <div className="mt-5 flex justify-center space-x-5">
            <Button
              intent="warning"
              isDisabled={isSubmitting || isLoading || !next.can_denie}
              onPress={send_nope}
            >
              Indisponible
            </Button>
            <Button
              isDisabled={isSubmitting || isLoading || !next.can_approuve}
              onPress={send_okay}
            >
              Accepter
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
