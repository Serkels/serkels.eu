//
import { render } from "@react-email/render";
import Debug from "debug";
import { createTransport } from "nodemailer";
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
    env;
    transporter;
    constructor(env) {
        this.env = env;
        log("new");
        this.env = ENV.parse(env);
        this.transporter = createTransport({
            url: this.env.SMTP_URL,
            debug: true,
        });
    }
    async send(options) {
        log("send", options);
        return this.transporter.sendMail({
            from: this.env.EMAIL_FROM,
            ...options,
        });
    }
    async send_report(options) {
        log("send_report", options);
        return this.transporter.sendMail({
            from: this.env.EMAIL_FROM,
            to: this.env.REPORT_EMAIL_FROM,
            ...options,
        });
    }
    async send_react_email(component, options) {
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
