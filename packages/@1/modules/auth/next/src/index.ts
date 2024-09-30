//

import { auth } from "./auth.config";
import "./next-auth.d.ts";
export * from "./auth.config";

/**
 * @deprecated Use `authimport type adapter from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
` instead
 */
export function getServerSession() {
  return auth();
}

export type { Session } from "next-auth";
