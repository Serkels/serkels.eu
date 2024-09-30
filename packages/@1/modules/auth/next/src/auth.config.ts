//

import prisma from "@1.infra/database";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { EmailConfig } from "next-auth/providers";
import callbacks from "./callbacks";
import nodemailer from "./nodemailer.provider";

//

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    error: "/badgate",
    newUser: "/signup/student",
    verifyRequest: "/signup/verifing#request",
  },
  callbacks,
  providers: [nodemailer as EmailConfig],
});
