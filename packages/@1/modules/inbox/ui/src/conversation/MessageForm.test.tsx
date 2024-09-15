//

import { GlobalRegistrator } from "@1.config/happydom";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, mock, test } from "bun:test";
import { FormProvider, useForm } from "react-hook-form";
import { message_form_resolver, MessageForm } from "./MessageForm";

//

const { userEvent } = await import("@testing-library/user-event");

//

afterEach(cleanup);

test("should send bonjour", async () => {
  const fn = mock<(value: string) => Promise<void>>();
  const user = userEvent.setup();

  function Component() {
    const form = useForm({
      resolver: message_form_resolver,
    });
    return (
      <FormProvider {...form}>
        <MessageForm onSubmit={fn} />
      </FormProvider>
    );
  }

  const { getByPlaceholderText, getByLabelText } = render(<Component />);
  await user.type(getByPlaceholderText("Envoie un message"), "Bonjour");
  await user.click(getByLabelText("Send"));

  expect(fn).toHaveBeenCalledWith("Bonjour");
});

test("should not send empty content", async () => {
  const fn = mock<(value: string) => Promise<void>>();
  const user = userEvent.setup();

  function Component() {
    const form = useForm({
      resolver: message_form_resolver,
    });
    return (
      <FormProvider {...form}>
        <MessageForm onSubmit={fn} />
      </FormProvider>
    );
  }

  const { getByPlaceholderText, getByLabelText } = render(<Component />);
  await user.type(getByPlaceholderText("Envoie un message"), " ");
  await user.click(getByLabelText("Send"));

  expect(fn).not.toHaveBeenCalled();
});

test.skip("should send content by pressing Enter", async () => {
  const fn = mock<(value: string) => Promise<void>>();
  const user = userEvent.setup();

  function Component() {
    const form = useForm({
      resolver: message_form_resolver,
    });
    return (
      <FormProvider {...form}>
        <MessageForm onSubmit={fn} />
      </FormProvider>
    );
  }

  const { getByPlaceholderText } = render(<Component />);
  const textarea = getByPlaceholderText("Envoie un message");
  await user.type(textarea, "Super cool");
  await user.type(textarea, "{enter}");

  expect(fn).toHaveBeenCalledWith("Super cool");
});

test.skip("should not send empty content by pressing Enter on mobile", async () => {
  GlobalRegistrator.unregister();
  GlobalRegistrator.register({
    settings: {
      navigator: {
        userAgent: "Chrome/114.0.0.0 Mobile",
      },
    },
  });

  const fn = mock<(value: string) => Promise<void>>();
  const user = userEvent.setup();

  function Component() {
    const form = useForm({
      resolver: message_form_resolver,
    });
    return (
      <FormProvider {...form}>
        <MessageForm onSubmit={fn} />
      </FormProvider>
    );
  }

  const { getByPlaceholderText } = render(<Component />);
  const textare = getByPlaceholderText("Envoie un message");
  await user.type(textare, "Super cool");
  await user.type(textare, "{enter}");

  expect(fn).not.toHaveBeenCalled();
});
