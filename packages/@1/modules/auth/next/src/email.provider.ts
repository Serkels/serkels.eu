//

import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import Email_Provider from "next-auth/providers/email";
import { trpc } from "./trpc";

//

export const Email = Email_Provider({
  secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
  async sendVerificationRequest(params) {
    await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
  },
});

Email.sendVerificationRequest = async (params) => {
  await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
};
