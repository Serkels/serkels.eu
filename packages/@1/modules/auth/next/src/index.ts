//

import { getServerSession as nextauth_getServerSession } from "next-auth";
import { auth_options } from "./config";
import "./next-auth.d.ts";

export { get_csrf_token } from "./csrf_token";
export function getServerSession() {
  return nextauth_getServerSession(auth_options);
}

export type { Session } from "next-auth";
