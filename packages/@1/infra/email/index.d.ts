import type Mail from "nodemailer/lib/mailer";
import type { ReactElement } from "react";
import { z } from "zod";
export declare const ENV: z.ZodObject<{
    EMAIL_FROM: z.ZodDefault<z.ZodString>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    REPORT_EMAIL_FROM: z.ZodDefault<z.ZodString>;
    SMTP_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    EMAIL_FROM: string;
    NODE_ENV: "development" | "test" | "production";
    REPORT_EMAIL_FROM: string;
    SMTP_URL: string;
}, {
    SMTP_URL: string;
    EMAIL_FROM?: string | undefined;
    NODE_ENV?: "development" | "test" | "production" | undefined;
    REPORT_EMAIL_FROM?: string | undefined;
}>;
export declare class Email_Sender {
    private readonly env;
    private readonly transporter;
    constructor(env: z.input<typeof ENV>);
    send(options: Mail.Options): Promise<any>;
    send_report(options: Mail.Options): Promise<any>;
    send_react_email(component: ReactElement, options: Omit<Mail.Options, "html" | "text">): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map