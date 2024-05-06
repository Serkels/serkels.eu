//

import type { PrismaClient } from "@1.infra/database";
import type { Email_Sender } from "@1.infra/email";
import type {
  NEXT_AUTH_HEADER,
  NextAuth_TRPCContext,
} from "@douglasduteil/nextauth...trpc.prisma/config";

//

export interface Context extends Omit<NextAuth_TRPCContext, "prisma"> {
  prisma: PrismaClient;
  sender: Email_Sender;
  headers: { origin: string } & NEXT_AUTH_HEADER;
}
