//

import {
  create_joedart_student,
  create_masterclass_category,
  create_slap_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { create_nextauth_header, createCallerFactory } from "@1.modules/trpc";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import find_router_legacy from "../find";

//

const NEXTAUTH_SECRET = "🔑";

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
    const caller = createCallerFactory(find_router_legacy);
    const trpc = caller({ prisma } as any);
    const exchange = await trpc.public({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list successful exchanges", async () => {
    await prisma.exchange.update({
      data: { is_active: false },
      where: { id: "slap-exchange" },
    });
    const caller = createCallerFactory(find_router_legacy);
    const trpc = caller({ prisma } as any);
    const exchange = await trpc.public({});
    expect(exchange).toMatchSnapshot();
  });

  test("should not list expired exchanges", async () => {
    await prisma.exchange.update({
      data: { expiry_date: new Date("2011-11-10") },
      where: { id: "slap-exchange" },
    });
    const caller = createCallerFactory(find_router_legacy);
    const trpc = caller({ prisma } as any);
    const exchange = await trpc.public({});
    expect(exchange).toMatchSnapshot();
  });
});

describe("connected studient", () => {
  test("should return latest exchanges", async () => {
    const nextauth_header = await create_nextauth_header({
      secret: "🔑",
      token: {
        from: "by_id.e2e.test.te",
        profile: { id: "douglas", role: "STUDENT" },
      },
    });
    const caller = createCallerFactory(find_router_legacy);
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.private({});
    expect(exchange).toMatchSnapshot();
  });
});
//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  const joedart_student = await create_joedart_student(prisma);

  await create_slap_exchange(prisma, joedart_student);
});
afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.exchange.deleteMany({});
  await prisma.user.deleteMany({});
});
