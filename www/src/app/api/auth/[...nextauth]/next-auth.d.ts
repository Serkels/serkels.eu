//

import type { components } from "@1/strapi-openapi/v1";
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
    username: string;
    profile: components["schemas"]["UserProfile"];
  }
  //   refreshTokenExpires?: number;
  //   accessTokenExpires?: string;
  //   refreshToken?: string;
  //   token?: string;
  //   error?: string;
  //   user?: User;
  // }
  // interface User {
  //   firstName?: string;
  //   lastName?: string;
  //   email?: string | null;
  //   id?: string;
  //   contactAddress?: {
  //     id?: string;
  //   };
  // }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: User;
  }
  //   refreshTokenExpires?: number;
  //   accessTokenExpires?: number;
  //   refreshToken?: string;
  //   token: string;
  //   exp?: number;
  //   iat?: number;
  //   jti?: string;
  // }
}
