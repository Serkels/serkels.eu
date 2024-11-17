//

import {
  create_douglas_student,
  create_joedart_student,
  create_masterclass_category,
  create_slap_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import {
  douglas_student_session,
  NEXTAUTH_SECRET,
} from "@1.modules/trpc/testing";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import find_api_router from "./find";

//

beforeAll(() => {
  process.env["NEXTAUTH_SECRET"] = NEXTAUTH_SECRET;
});

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

describe("visitor", () => {
  test("should return latest exchanges", async () => {
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({ auth: () => null, prisma } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list successful exchanges", async () => {
    await prisma.exchange.update({
      data: { is_active: false },
      where: { id: "slap_exchange_id" },
    });
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({ auth: () => null, prisma } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list expired exchanges", async () => {
    await prisma.exchange.update({
      data: { expiry_date: new Date("2011-11-10") },
      where: { id: "slap_exchange_id" },
    });
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({ auth: () => null, prisma } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });
});

describe("connected studient", () => {
  test("should return latest exchanges", async () => {
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({
      auth: () => douglas_student_session,
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list exchanges created by profile I blocked", async () => {
    await prisma.profile.update({
      data: { blacklist: { create: { profile_id: "joedart_profile_id" } } },
      where: { id: "douglas_profile_id" },
    });
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({
      auth: () => douglas_student_session,
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list exchanges created by profiles who blocked me", async () => {
    await prisma.profile.update({
      data: { blacklisted_by: { create: { owner_id: "joedart_profile_id" } } },
      where: { id: "douglas_profile_id" },
    });
    const caller = createCallerFactory(find_api_router);
    const trpc = caller({
      auth: () => douglas_student_session,
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchSnapshot();
  });
});

//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  await create_douglas_student(prisma);
  const joedart_student = await create_joedart_student(prisma);
  await create_slap_exchange(prisma, joedart_student);
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.exchange.deleteMany({});
  await prisma.user.deleteMany({});
});
