"use server";

import { signIn } from "@1.modules/auth.next/auth";
import { startSpan } from "@sentry/core";
import { createServerAction } from "zsa";
import { login_form_schema } from "../schema/login";

//

export default createServerAction()
  .input(login_form_schema)
  .handler(async ({ input: { email } }) => {
    return startSpan(
      { name: "login_action#Login(credentials)", op: "www" },
      async function login_action() {
        // const user = await get_user_by_email(email);
        // if (user) {
        //   throw new Error("User already exists");
        // }

        return await signIn("nodemailer", { email, redirect: false });
      },
    );
  });
