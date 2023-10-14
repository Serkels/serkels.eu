//

import process from "node:process";
import { PrismaClient } from ".";

//

export const prisma = new PrismaClient({
  log:
    process.env["NODE_ENV"] === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

export { PrismaClient } from "@prisma/client";
