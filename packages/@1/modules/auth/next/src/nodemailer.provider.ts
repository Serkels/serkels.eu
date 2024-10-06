//

import { Email_Sender } from "@1.infra/email";
import { SerkelsMagicLinkEmail } from "@1.modules/auth.emails";
import { env_app_url_schema } from "@1.modules/core/env.zod";
import Nodemailer from "next-auth/providers/nodemailer";
import { z } from "zod";

//

const { APP_URL } = env_app_url_schema.parse(process.env);
const { EMAIL_SERVER } = z
  .object({
    EMAIL_FROM: z.string().default("no-reply@serkels.eu"),
    EMAIL_SERVER: z.string().url().default("http://localhost:1025"),
  })
  .parse(process.env);

//

export default Nodemailer({
  server: { url: EMAIL_SERVER },
  async sendVerificationRequest(params) {
    const sender = new Email_Sender(process.env as any);
    const token_url = new URL(params.url);
    const url = new URL(
      token_url.pathname + token_url.search + token_url.hash,
      APP_URL,
    );
    await sender.send_react_email(
      SerkelsMagicLinkEmail({
        base_url: params.request.headers.get("origin") ?? APP_URL,
        url: url.toString(),
      }),
      {
        subject: "[Serkels] Connexion",
        to: params.identifier,
      },
    );
  },
});
