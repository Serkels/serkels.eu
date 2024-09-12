//

import { test } from "bun:test";
import auth_api_router from "./index";
import { createCallerFactory, type Context } from "@1.modules/trpc";
import { Email_Sender } from "@1.infra/email";
import { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";

//

test("auth_api_router", async () => {
  const NEXTAUTH_SECRET = "NEXTAUTH_SECRET";
  process.env["NEXTAUTH_SECRET"] = NEXTAUTH_SECRET;
  const route = auth_api_router({
    NEXTAUTH_SECRET,
    JWT_EXPIRE_PERIOD: "30d",
    MAGIC_TOKEN_EXPIRE_PERIOD: 1,
    MAGIC_TOKEN_LENGHT: 32,
  });
  const caller = createCallerFactory(route);
  const nexauth_header = await create_nexauth_header({
    secret: NEXTAUTH_SECRET,
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
