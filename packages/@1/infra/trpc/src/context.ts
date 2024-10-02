//

import prisma from "@1.infra/database";
import { Email_Sender } from "@1.infra/email";
import { auth } from "@1.modules/auth.next";
import { env_app_url_schema } from "@1.modules/core/env.zod";
import type { Context } from "@1.modules/trpc";

//

const { APP_URL } = env_app_url_schema.parse(process.env);

export const context: Context = {
  auth,
  headers: { NEXTAUTH_TOKEN: "🎫", origin: APP_URL },
  prisma,
  sender: new Email_Sender(process.env as any),
};
