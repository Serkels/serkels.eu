//

import { PrismaClient } from "@1.infra/database";

//

export interface Context {
  prisma: PrismaClient;
}
