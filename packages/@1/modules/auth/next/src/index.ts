//

/// <reference types="./next-auth.d.ts" />

import { auth } from "./auth.config";
export * from "./auth.config";

/**
 * @deprecated Use `authimport type adapter from "@douglasduteil/nextauth...trpc.prisma/trpc/router/adapter";
` instead
 */
export function getServerSession() {
  return auth();
}

export type { Session } from "next-auth";
