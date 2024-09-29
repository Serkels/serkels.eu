//

import prisma from "@1.infra/database";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { EmailConfig } from "next-auth/providers";
import callbacks from "./callbacks";
import { nodemailer } from "./nodemailer";

//
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks,
  providers: [nodemailer as EmailConfig],
});

//
