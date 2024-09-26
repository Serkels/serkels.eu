//

import NextAuth from "next-auth";
import { auth_options } from "./config";

//

export const handler = NextAuth(auth_options);
