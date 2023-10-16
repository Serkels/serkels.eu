//

import {
  decode as jwt_decode,
  encode as jwt_encode,
  type JWT,
  type JWTDecodeParams,
  type JWTEncodeParams,
} from "next-auth/jwt";

//

export async function create_nexauth_header(params: JWTEncodeParams) {
  return { NEXTAUTH_TOKEN: await jwt_encode(params) };
}

/** Decodes a NextAuth.js issued JWT. */
export async function decode(params: JWTDecodeParams): Promise<JWT | null> {
  return jwt_decode(params);
}
