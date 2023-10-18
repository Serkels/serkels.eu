//

import { authOptions } from "@1.modules/auth.next/config";
import NextAuth from "next-auth";

//

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
