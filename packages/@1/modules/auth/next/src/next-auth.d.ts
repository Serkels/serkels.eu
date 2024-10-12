//

import type { AuthProfile } from "@1.modules/profile.domain";
import "next-auth";
import type { create_nextauth_header } from "./jwt";

//

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    profile: AuthProfile;
    header: Awaited<ReturnType<typeof create_nextauth_header>>;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    profile?: AuthProfile;
  }
}
