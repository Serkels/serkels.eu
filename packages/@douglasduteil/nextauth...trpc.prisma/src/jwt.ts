//

import {
  decode as jwt_decode,
  encode as jwt_encode,
  type JWTDecodeParams,
  type JWT as NextAuth_JWT,
  type JWTEncodeParams as NextAuth_JWTEncodeParams,
} from "next-auth/jwt";

export interface JWT extends NextAuth_JWT {
  from?: string;
}

export interface JWTEncodeParams<TToken> extends NextAuth_JWTEncodeParams {
  token?: JWT & TToken;
}

//

export async function create_nextauth_header<TToken extends object>(
  params: JWTEncodeParams<TToken>,
) {
  return { NEXTAUTH_TOKEN: await jwt_encode(params) };
}

export async function decode(params: JWTDecodeParams): Promise<JWT | null> {
  return (await jwt_decode(params)) as JWT;
}
