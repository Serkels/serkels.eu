//

import { auth_options } from "@1.modules/auth.next/config";
import NextAuth from "next-auth";

//

const handler = NextAuth(auth_options);
export { handler as GET, handler as POST };
