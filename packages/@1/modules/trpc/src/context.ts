//

import type { Email_Sender } from "@1.infra/email";
import type { NextAuth_TRPCContext } from "@douglasduteil/nextauth...trpc.prisma/config";

//

export interface Context extends NextAuth_TRPCContext {
  // prisma: PrismaClient;
  sender: Email_Sender;
  headers: { origin: string } & NextAuth_TRPCContext["headers"];
}
