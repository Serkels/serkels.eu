//

import { AuthError } from "@1.modules/core/errors";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import Email_Provider from "next-auth/providers/email";
import { trpc } from "./trpc";

//

const { AUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);

export const Email = Email_Provider({
  secret,
  async sendVerificationRequest(params) {
    try {
      await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
    } catch (cause) {
      console.error("Error sending verification email:", cause);
      throw new AuthError("Error sending verification email", { cause });
    }
  },
});

Email.sendVerificationRequest = async (params) => {
  try {
    await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
  } catch (cause) {
    console.error("Error sending verification email:", cause);
    throw new AuthError("Error sending verification email", { cause });
  }
};
