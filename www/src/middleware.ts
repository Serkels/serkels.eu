//

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      return Boolean(token?.user?.profile?.id);
    },
  },
  pages: {
    signIn: "/",
  },
});

export const config = { matcher: ["/exchange", "/@:code/:path*"] };
