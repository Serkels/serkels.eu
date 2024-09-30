//

import { Email_Sender } from "@1.infra/email";
import { SerkelsMagicLinkEmail } from "@1.modules/auth.emails";
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
    await sender.send_react_email(
      SerkelsMagicLinkEmail({
        base_url: params.request.headers.get("origin") ?? APP_URL,
        url: params.url,
      }),
      {
        subject: "[Serkels] Connexion",
        to: params.identifier,
      },
    );
  },
});
