//

import { encode, type JWT, type JWTEncodeParams } from "next-auth/jwt";

//

export async function create_nextauth_header<TToken extends JWT>(
  params: Omit<JWTEncodeParams<TToken>, "salt">,
) {
  return { NEXTAUTH_TOKEN: await encode({ ...params, salt: "🧂" }) };
}

export { decode } from "next-auth/jwt";
