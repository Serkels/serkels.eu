//

import { PrismaClient as PrismaClient_Base } from "@prisma/client";
import process from "node:process";

//

export { Prisma } from "@prisma/client";

//

const prismaClientSingleton = () => {
  return new PrismaClient_Base({
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

const prisma = prismaClientSingleton();
export type PrismaClient = typeof prisma;

export default prisma;
