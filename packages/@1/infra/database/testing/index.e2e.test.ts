//

import { beforeAll, expect, test } from "bun:test";
import prisma, { empty_database, migrate } from ".";

//

beforeAll(empty_database);
beforeAll(migrate);

//

test("database is working", async () => {
  expect(await prisma.$queryRaw<any>`SELECT 1`).toEqual([
    {
      "?column?": 1,
    },
  ]);
});

test("user table is empty", async () => {
  const users = await prisma.user.findMany();
  expect(users).toEqual([]);
});

test("profile table is empty", async () => {
  const profiles = await prisma.profile.findMany();
  expect(profiles).toEqual([]);
});
