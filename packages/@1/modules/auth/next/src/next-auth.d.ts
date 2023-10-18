//

import type { PROFILE_ROLES, Profile } from "@1.modules/profile.domain";
import "next-auth";

//

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    profile?: Profile;
  }
  interface User extends DefaultUser {
    id: string;
    name: string;
    role: PROFILE_ROLES;

    /**
     * @deprecated
     */
    profile: any;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: User;
    profile?: Profile;
  }
}
