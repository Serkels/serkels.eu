//

import {
  create_douglas_student,
  create_film_category,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory, type Session } from "@1.modules/trpc";
import { afterAll, beforeAll, expect, setSystemTime, test } from "bun:test";
import create_quetion from "./create";

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

const auth = () =>
  ({
    profile: { id: "douglas_profile_id" },
  }) as Session;

test("return a new question", async () => {
  const caller = createCallerFactory(create_quetion);
  const trpc = caller({
    auth,
    prisma,
  } as any);
  const response = await trpc.create({
    category: "film_category_id",
    title: "What is the best film of 2011 ?",
  });
  expect(response).toMatchSnapshot({
    id: expect.any(String),
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  });
});

//

beforeAll(async function seed() {
  await create_film_category(prisma);
  await create_douglas_student(prisma);
});

afterAll(async function empty_delete_entries() {
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});
