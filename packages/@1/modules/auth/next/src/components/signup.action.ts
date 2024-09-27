"use server";

import prisma from "@1.infra/database";
import { signIn } from "@1.modules/auth.next/auth";
import { get_user_by_email } from "@1.modules/auth.next/repository/get_user_by_email";
import { startSpan } from "@sentry/core";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import { createServerAction } from "zsa";
import { signup_form_schema } from "../schema/signup";

//

export const signup_action = createServerAction()
  .input(signup_form_schema)
  .handler(async ({ input: { email, password, role } }) => {
    return startSpan(
      { name: "signup_action#signIn(credentials)", op: "www" },
      async function signup_action() {
        const user = await get_user_by_email(email);
        if (user) {
          throw new Error("User already exists");
        }

        const hashed_password = await bcrypt.hash(password, 10);
        const token = await encode({
          salt: "",
          secret: process.env["AUTH_SECRET"]!,
        });

        await prisma.signupPayload.upsert({
          create: {
            context: { password: hashed_password },
            email,
            name: "",
            role,
            tokens: {
              create: { identifier: email, token, expires: new Date() },
            },
          },
          update: {
            tokens: {
              create: { identifier: email, token, expires: new Date() },
            },
          },
          where: { email },
        });

        return await signIn("nodemailer", { email, redirect: false });
      },
    );
  });
