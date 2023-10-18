//

import { getServerSession as nextauth_getServerSession } from "next-auth";
import { authOptions } from "./config";
import "./next-auth.d.ts";

export { get_csrf_token } from "./csrf_token";
export function getServerSession() {
  return nextauth_getServerSession(authOptions);
}
