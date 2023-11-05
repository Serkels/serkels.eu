"use client";

import { TRPC_React } from ":trpc/client";
import {
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_DENIED,
} from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { Field, Form, Formik } from "formik";
import { useCallback } from "react";

//

export default function Conversation_Form({
  thread_id,
}: {
  thread_id: string;
}) {
  const { isLoading, mutateAsync } = TRPC_React.inbox.thread.send.useMutation();
  const utils = TRPC_React.useUtils();
  const send_message = useCallback(
    async (content: string) => {
      await mutateAsync({ content, thread_id });
      await utils.inbox.thread.messages.invalidate({ thread_id });
      await utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id);
    },
    [mutateAsync, thread_id],
  );
  const send_okay = useCallback(() => {
    send_message(HANDSHAKE_ACCEPETED);
  }, [thread_id]);
  const send_nope = useCallback(() => {
    send_message(HANDSHAKE_DENIED);
  }, [thread_id]);

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
              isDisabled={isSubmitting || isLoading}
              onPress={send_nope}
            >
              Indisponible
            </Button>
            <Button isDisabled={isSubmitting || isLoading} onPress={send_okay}>
              Accepter
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
