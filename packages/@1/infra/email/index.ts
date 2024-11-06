//

import { render } from "@react-email/render";
import Debug from "debug";
import { createTransport, type Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { ReactElement } from "react";
import { z } from "zod";

//

const log = Debug("packages/@1/infra/email/index.ts");

export const ENV = z.object({
  EMAIL_FROM: z.string().email().default("no-reply@toc-toc.org"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  REPORT_EMAIL_FROM: z.string().email().default("tyree.braun84@ethereal.email"),
  SMTP_URL: z.string(),
});

//

export class Email_Sender {
  private readonly transporter: Transporter;

  constructor(private readonly env: z.input<typeof ENV>) {
    log("new");
    this.env = ENV.parse(env);
    this.transporter = createTransport({
      url: this.env.SMTP_URL,
      debug: true,
    });
  }

  async send(options: Mail.Options) {
    log("send", options);
    return this.transporter.sendMail({
      from: this.env.EMAIL_FROM,
      ...options,
    });
  }

  async send_report(options: Mail.Options) {
    log("send_report", options);
    return this.transporter.sendMail({
      from: this.env.EMAIL_FROM,
      to: this.env.REPORT_EMAIL_FROM,
      ...options,
    });
  }

  async send_react_email(
    component: ReactElement,
    options: Omit<Mail.Options, "html" | "text">,
  ) {
    log("send_react_email", options);
    const html = await render(component);
    const text = await render(component, {
      plainText: true,
    });
    return this.transporter.sendMail({
      from: this.env.EMAIL_FROM,
      ...options,
      html,
      text,
    });
  }
}
