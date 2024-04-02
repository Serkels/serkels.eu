//

import { render } from "@react-email/render";
import Debug from "debug";
import { createTransport } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { ReactElement } from "react";
import { z } from "zod";

//

const log = Debug("packages/@1/infra/email/index.ts");

const ENV = z
  .object({
    EMAIL_FROM: z.string().email().default("tyree.braun84@ethereal.email"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    REPORT_EMAIL_FROM: z
      .string()
      .email()
      .default("tyree.braun84@ethereal.email"),
    SMTP_HOST: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USERNAME: z.string(),
  })
  .parse(process.env);

//

export class Email_Sender {
  transporter = createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    auth: {
      user: ENV.SMTP_USERNAME,
      pass: ENV.SMTP_PASSWORD,
    },
    debug: true,
  });
  constructor() {
    log("new");
  }

  async send(options: Mail.Options) {
    log("send", options);
    return this.transporter.sendMail({
      from: ENV.EMAIL_FROM,
      ...options,
    });
  }

  async send_report(options: Mail.Options) {
    log("send_report", options);
    return this.transporter.sendMail({
      to: ENV.REPORT_EMAIL_FROM,
      ...options,
    });
  }

  async send_react_email(
    component: ReactElement,
    options: Omit<Mail.Options, "html" | "text">,
  ) {
    log("send_react_email", options);
    const html = render(component);
    const text = render(component, {
      plainText: true,
    });
    return this.transporter.sendMail({
      from: ENV.EMAIL_FROM,
      ...options,
      html,
      text,
    });
  }
}
