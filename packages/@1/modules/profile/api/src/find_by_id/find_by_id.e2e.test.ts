//

import {
  create_douglas_student,
  create_joedart_student,
  create_johan_student,
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
import find_by_id_api_router from "./find_by_id";

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

test("should return profile info to connected users", async () => {
  const caller = createCallerFactory(find_by_id_api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const response = await trpc.by_id("johan_profile_id");
  expect(response).toMatchSnapshot();
});

test("❎ do not allow visitors to see profile info", async () => {
  const caller = createCallerFactory(find_by_id_api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);

  await expect(trpc.by_id("jean_mich_profile_id")).rejects.toThrow();
});

test("❎ do not allow visitors to see profile info", async () => {
  const caller = createCallerFactory(find_by_id_api_router);
  const trpc = caller({
    auth: () => null,
    prisma,
  } as any);

  await expect(trpc.by_id("slap_exchange_id")).rejects.toThrowError(
    "No profile",
  );
});

//

beforeEach(async function seed() {
  await create_douglas_student(prisma);
  await create_johan_student(prisma);
  await create_joedart_student(prisma);
});

afterEach(async function empty_delete_entries() {
  await prisma.user.deleteMany({});
});
