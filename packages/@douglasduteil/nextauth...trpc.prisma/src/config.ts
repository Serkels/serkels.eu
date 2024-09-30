//

import { z } from "zod";
import PrismaClient from "./PrismaClient";

//

export const NEXT_AUTH_HEADER = z.object({ NEXTAUTH_TOKEN: z.string() });
export type NEXT_AUTH_HEADER = z.TypeOf<typeof NEXT_AUTH_HEADER>;

export interface NextAuth_TRPCContext<
  TPrismaClient extends PrismaClient = PrismaClient,
> {
  headers: NEXT_AUTH_HEADER;
  prisma: TPrismaClient;
}

export const NEXTAUTH_TRPCENV = z.object({
  NEXTAUTH_SECRET: z.string(),
});
