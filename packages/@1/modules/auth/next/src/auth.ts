//

import prisma from "@1.infra/database";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

//

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  theme: { logo: "/toc-toc.svg" },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
