//

import { PrismaClient as PrismaClient_Base } from "#prisma/client";
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

const prisma = prismaClientSingleton();
export type PrismaClient = typeof prisma;
export { CategoryContext, NotificationType } from "#prisma/client";
export type { Prisma } from "#prisma/client";

export default prisma;
