//

import {
  decode as jwt_decode,
  encode as jwt_encode,
  type JWTDecodeParams,
  type JWT as NextAuth_JWT,
  type JWTEncodeParams as NextAuth_JWTEncodeParams,
} from "next-auth/jwt";
import { createHash } from "node:crypto";

export interface JWT extends NextAuth_JWT {
  from?: string;
}

export interface JWTEncodeParams extends NextAuth_JWTEncodeParams {
  token?: JWT;
}

//

export async function create_nexauth_header(params: JWTEncodeParams) {
  return { NEXTAUTH_TOKEN: await jwt_encode(params) };
}

/** Decodes a NextAuth.js issued JWT. */
export async function decode(params: JWTDecodeParams): Promise<JWT | null> {
  return (await jwt_decode(params)) as JWT;
}

export function hashToken(
  token: string,
  options: { provider: { secret?: string }; secret?: string },
) {
  const { provider, secret } = options;
  return (
    createHash("sha256")
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${provider.secret ?? secret}`)
      .digest("hex")
  );
}
