"use server";

import { signIn } from "@1.modules/auth.next/auth";
import { login_form_schema } from "@1.modules/auth.next/auth.config";
import { startSpan } from "@sentry/nextjs";
import { createServerAction } from "zsa";

//

export const login_action = createServerAction()
  .input(login_form_schema, {
    type: "formData",
  })
  .handler(async ({ input: { email, password } }) => {
    return startSpan(
      { name: "login_action#signIn(credentials)", op: "www" },
      () =>
        signIn("credentials", {
          redirect: false,
          email,
          password,
        }),
    );
  });
