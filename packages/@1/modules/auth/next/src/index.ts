//

import { getServerSession as nextauth_getServerSession } from "next-auth";
import "./next-auth.d.ts";
import { authOptions } from "./nextauth.config";

export { get_csrf_token } from "./csrf_token";
export function getServerSession() {
  return nextauth_getServerSession(authOptions);
}
