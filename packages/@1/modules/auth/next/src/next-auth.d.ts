//

import type { AuthProfile } from "@1.modules/profile.domain";
import type { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import "next-auth";

//

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    profile: AuthProfile;
    header: Awaited<ReturnType<typeof create_nexauth_header>>;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    profile?: AuthProfile;
  }
}
