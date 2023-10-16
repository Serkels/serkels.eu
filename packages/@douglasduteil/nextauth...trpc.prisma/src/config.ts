//

import { PrismaClient } from "@prisma/client";
import process from "node:process";
import { z } from "zod";

//

export const NEXT_AUTH_HEADER = z.object({ NEXTAUTH_TOKEN: z.string() });
export type NEXT_AUTH_HEADER = z.TypeOf<typeof NEXT_AUTH_HEADER>;

export interface NextAuth_TRPCContext {
  headers: NEXT_AUTH_HEADER;
  prisma: PrismaClient;
}
export const SEND_VERIFICATION_REQUEST_INPUT_SCHEMA = z.object({
  identifier: z.string().email(),
  token: z.string(),
  expires: z.coerce.date(),
  url: z.string().url(),
});
export type SEND_VERIFICATION_REQUEST_INPUT_SCHEMA = z.TypeOf<
  typeof SEND_VERIFICATION_REQUEST_INPUT_SCHEMA
>;

export const NEXTAUTH_TRPCENV = z
  .object({
    NEXTAUTH_SECRET: z.string(),
  })
  .parse(process.env, { path: ["<NEXTAUTH_TRPCENV>", "process.env"] });
