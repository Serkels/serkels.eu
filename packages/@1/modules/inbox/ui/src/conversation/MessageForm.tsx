"use client";

import { useEnterToSubmit } from "@1.ui/react/form";
import { SendButton } from "@1.ui/react/form/SendButton";
import { input } from "@1.ui/react/form/atom";
import { PLATFORMS_MAP, useUserAgent } from "@1.ui/react/useragent";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { tv } from "tailwind-variants";
import { z } from "zod";

//

const form_zod_schema = z.object({
  message: z.string().trim().min(1),
});
export const message_form_resolver = zodResolver(form_zod_schema);
export type FormValues = z.infer<typeof form_zod_schema>;

export function MessageForm({
  isDisabled,
  onSubmit,
}: {
  isDisabled?: boolean;
  onSubmit: (content: string) => Promise<void>;
}) {
  const browser = useUserAgent();
  const { register, handleSubmit, formState, setValue, setFocus } =
    useFormContext<FormValues>();
  const on_submit: SubmitHandler<FormValues> = async ({ message: content }) => {
    if (content === "") return;
    await onSubmit(content);
    setValue("message", "");
    setFocus("message");
  };

  if (browser.getPlatformType() === PLATFORMS_MAP.desktop)
    useEnterToSubmit({
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
        className={textarea_style()}
        disabled={isDisabled}
        readOnly={formState.isSubmitting}
        placeholder="Envoie un message"
      ></textarea>
      <SendButton
        isDisabled={isDisabled}
        isSubmitting={formState.isSubmitting}
      />
    </form>
  );
}

const textarea_style = tv({
  extend: input,
  base: `
    peer
    max-h-32
    min-h-16
    w-full
    resize-none
    rounded-2xl
    pr-14
  `,
});
