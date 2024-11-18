//

import {
  create_douglas_student,
  create_film_category,
  create_the_creator_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import { douglas_student_session } from "@1.modules/trpc/testing";
import { afterEach, beforeAll, beforeEach, expect, test } from "bun:test";
import api_router from "./check";

//

beforeAll(empty_database);
beforeAll(migrate);

//

test("return false when an exchange is not bookmarked", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const data = await trpc.check({
    target_id: "the_creator_exchange_id",
    type: "exchange",
  });
  expect(data).toBeFalse();
});

test("return true when an exchange is bookmarked", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);

  await prisma.bookmark.create({
    data: {
      owner_id: "douglas_profile_id",
      exchange_id: "the_creator_exchange_id",
    },
  });

  const data = await trpc.check({
    target_id: "the_creator_exchange_id",
    type: "exchange",
  });
  expect(data).toBeTrue();
});

//

beforeEach(async function seed() {
  await create_douglas_student(prisma);
  await create_film_category(prisma);
  await create_the_creator_exchange(prisma, "douglas_student_id");
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});
