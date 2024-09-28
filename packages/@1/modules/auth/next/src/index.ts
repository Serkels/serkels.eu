//

import NextAuth from "next-auth";
// import { auth_options } from "./config";
import "./next-auth.d.ts";
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config";

// const prisma = new PrismaClient()

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

export { get_csrf_token } from "./csrf_token";

/**
 * @deprecated Use `authimport type adapter from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
` instead
 */
export function getServerSession() {
  return auth();
}

export type { Session } from "next-auth";
