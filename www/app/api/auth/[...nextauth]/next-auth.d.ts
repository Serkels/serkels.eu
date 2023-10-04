//

import "next-auth";
//

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: User;
  }
  interface User extends DefaultUser {
    jwt: string;
    id: number;
    name: string;
    role: "partner" | "studient";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: User;
  }
}
