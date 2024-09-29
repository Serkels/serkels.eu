import Nodemailer from "next-auth/providers/nodemailer";
import { z } from "zod";

//

const { EMAIL_SERVER } = z
  .object({
    EMAIL_SERVER: z.string().url().default("http://localhost:1025"),
    EMAIL_FROM: z.string().default("no-reply@serkels.eu"),
  })
  .parse(process.env);

//

export const nodemailer = Nodemailer({
  server: { url: EMAIL_SERVER },
});
