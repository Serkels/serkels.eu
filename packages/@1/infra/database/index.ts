//

import { PrismaClient as PrismaClient_Base } from "@prisma/client";
import process from "node:process";

//

const prismaClientSingleton = () => {
  return new PrismaClient_Base({
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export type PrismaClient = typeof prisma;

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env["NODE_ENV"] !== "production") globalThis.prismaGlobal = prisma;
