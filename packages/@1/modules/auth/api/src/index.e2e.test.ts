//

import { Email_Sender } from "@1.infra/email";
import { createCallerFactory, type Context } from "@1.modules/trpc";
import { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { test } from "node:test";
import auth_api_router from "./index";

//

test("auth_api_router", async () => {
  const AUTH_SECRET = "AUTH_SECRET";
  process.env["AUTH_SECRET"] = AUTH_SECRET;
  const route = auth_api_router({
    AUTH_SECRET,
    JWT_EXPIRE_PERIOD: "30d",
    MAGIC_TOKEN_EXPIRE_PERIOD: 1,
    MAGIC_TOKEN_LENGHT: 32,
  });
  const caller = createCallerFactory(route);
  const nexauth_header = await create_nexauth_header({
    secret: AUTH_SECRET,
    salt: "",
  });
  const trpc = caller({
    headers: { ...nexauth_header, origin: "https://serkels.fr" },
    prisma: {},
    sender: new Email_Sender({
      SMTP_URL:
        "smtp://tyree.braun84%40ethereal.email:Sy4z8SGJMb6SUazyeh@smtp.ethereal.email:587",
    }),
  } as Context);

  await trpc.next_auth_provider.sendVerificationRequest({
    identifier: "douglas@yopmail.com",
    url: "https://serkels.fr/api/auth/callback/email",
  });
});
