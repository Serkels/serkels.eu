//

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      return Boolean(token?.user?.profile?.firstname);
    },
  },
  pages: {
    signIn: "/",
  },
});

export const config = { matcher: ["/exchange", "/my/:path*"] };
