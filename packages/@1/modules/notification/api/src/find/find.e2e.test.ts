//

import {
  create_douglas_student,
  create_greatings_message,
  create_joedart_student,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import { douglas_student_session } from "@1.modules/trpc/testing";
import {
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import find_api_router from "./find";

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

test("should return latest notifications", async () => {
  const caller = createCallerFactory(find_api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const exchange = await trpc.find({});
  expect(exchange).toMatchSnapshot();
});

//

beforeEach(async function seed() {
  await create_douglas_student(prisma);
  await create_joedart_student(prisma);
  await create_greatings_message(
    prisma,
    "douglas_profile_id",
    "joedart_profile_id",
  );
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});
});
