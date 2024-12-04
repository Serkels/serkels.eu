//

import { create_douglas_student } from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import { beforeAll, expect, test } from "bun:test";
import verify_router from "./verify";

//

beforeAll(empty_database);
beforeAll(migrate);

//

test("return found user id", async () => {
  await create_douglas_student(prisma);
  const caller = createCallerFactory(verify_router);
  const trpc = caller({ prisma } as any);
  const response = await trpc.verify({ email: "douglas@example.com" });
  expect(response).toEqual({ id: "douglas_user_id" });
});

test("return null when user not found", async () => {
  const caller = createCallerFactory(verify_router);
  const trpc = caller({ prisma } as any);
  const response = await trpc.verify({ email: "douglas@serkels.com" });
  expect(response).toBeNull();
});
