//

import { decode } from "@1.modules/auth.next/jwt";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";

//

export function VerifyNextAuthTokenUseCase<T>(token: string) {
  return async function verify_next_auth_token_exec() {
    const { NEXTAUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);

    const payload = (await decode({
      token,
      salt: "🧂",
      secret,
    })) as T;

    if (!payload) {
      throw new Error("No payload");
    }

    return payload;
  };
}
