//

import NextAuth from "next-auth";
import { auth_options } from "./config";
import "./next-auth.d.ts";

export const { auth, handlers, signIn, signOut, unstable_update } =
  NextAuth(auth_options);

export { get_csrf_token } from "./csrf_token";
export function getServerSession() {
  return auth();
}

export type { Session } from "next-auth";
