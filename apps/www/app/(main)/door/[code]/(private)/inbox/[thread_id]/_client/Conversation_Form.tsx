"use client";

import { THROTTLED_DELAY } from ":app/constants";
import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import { Button, type ButtonProps } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import {
  useKeyboardEvent,
  useThrottledCallback,
  useToggle,
} from "@react-hookz/web";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { match } from "ts-pattern";
import { z } from "zod";

//

const form_zod_schema = z.object({
  message: z.string(),
});
type FormValues = z.infer<typeof form_zod_schema>;

//

export default function Conversation_Form({ thread_id }: Params) {
  const { register, handleSubmit, formState, setValue, setFocus } =
    useForm<FormValues>();
  const { mutateAsync } = TRPC_React.inbox.thread.send.useMutation();
  const on_submit: SubmitHandler<FormValues> = async ({ message: content }) => {
    if (content === "") return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await mutateAsync({ content, thread_id });
    setValue("message", "");
    setFocus("message");
  };

  use_enter_to_submit({
    is_submitting: formState.isSubmitting,
    on_submit: handleSubmit(on_submit),
  });

  useLayoutEffect(() => {
    setFocus("message");
  }, [setFocus]);

  return (
    <form className="relative w-full" onSubmit={handleSubmit(on_submit)}>
      <textarea
        {...register("message")}
        autoComplete="off"
        className={input({
          className: "peer w-full rounded-2xl pr-10",
        })}
        readOnly={formState.isSubmitting}
        placeholder="Envoi un Message…"
      ></textarea>
      <span className="absolute inset-y-0 right-5 flex items-center pl-2">
        <AnimatePresence>
          {match(formState)
            .with({ isSubmitting: true }, () => (
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                className="absolute right-0"
                exit={{ opacity: 0, scale: 0.5 }}
                initial={{ y: -10, opacity: 0 }}
                key="spinner"
                transition={{ duration: 0.66 }}
              >
                <Spinner className="size-4 text-success" />
              </motion.div>
            ))
            .otherwise(() => (
              <motion.div
                animate={{ x: 0, y: 0, opacity: 1 }}
                className="absolute right-0"
                exit={{ x: 10, y: -10, opacity: 0 }}
                initial={{ x: 0, y: 10, opacity: 0 }}
                key="submit_button"
                transition={{ ease: "easeInOut", duration: 0.66 }}
              >
                <SubmitButton isDisabled={formState.isSubmitting} />
              </motion.div>
            ))}
        </AnimatePresence>
      </span>
    </form>
  );
}

//

function use_enter_to_submit({
  is_submitting,
  on_submit,
}: {
  is_submitting: boolean;
  on_submit: () => void;
}) {
  const [can_submit_with_enter, set_can_submit_with_enter] = useToggle(true);

  const throttled_on_submit = useThrottledCallback(
    on_submit,
    [],
    THROTTLED_DELAY,
  );
  useKeyboardEvent(
    "Enter",
    () => {
      if (!can_submit_with_enter) return;
      if (is_submitting) return;
      throttled_on_submit();
    },
    [can_submit_with_enter, is_submitting],
    {
      event: "keydown",
    },
  );
  useKeyboardEvent("Shift", () => set_can_submit_with_enter(), [], {
    event: "keyup",
  });
  useKeyboardEvent("Shift", () => set_can_submit_with_enter(), [], {
    event: "keydown",
  });
}

function SubmitButton(props: ButtonProps) {
  return (
    <Button
      className="focus:shadow-outline p-1 focus:outline-none"
      intent="light"
      type="submit"
      {...props}
    >
      <PaperPlane className="h-6 w-6 text-success" />
    </Button>
  );
}
