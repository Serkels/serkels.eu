//

import {
  create_douglas_student,
  create_joedart_student,
  create_johan_student,
  create_masterclass_category,
  create_slap_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import {
  create_nextauth_header,
  createCallerFactory,
  router,
} from "@1.modules/trpc";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import exchange_by_id from "./by_id";

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
  test("should return a sanitize exchange", async () => {
    const caller = createCallerFactory(router({ by_id: exchange_by_id }));
    const trpc = caller({
      prisma,
    } as any);
    const exchange = await trpc.by_id("slap_exchange_id");
    expect(exchange).toMatchSnapshot();
  });
});

describe("connected studient", () => {
  let nextauth_header: Awaited<ReturnType<typeof create_nextauth_header>>;

  beforeAll(async () => {
    nextauth_header = await create_nextauth_header({
      secret: "🔑",
      token: {
        from: import.meta.url,
        profile: { id: "douglas_profile_id", role: "STUDENT" },
      },
    });
  });

  test("should return a sanitize exchange", async () => {
    const caller = createCallerFactory(router({ by_id: exchange_by_id }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.by_id("slap_exchange_id");
    expect(exchange).toMatchSnapshot();
  });
});

//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  const douglas_student_id = await create_douglas_student(prisma);
  const johan_student_id = await create_johan_student(prisma);
  const joedart_student = await create_joedart_student(prisma);
  const { id: exchange_id } = await create_slap_exchange(
    prisma,
    joedart_student,
  );
  await prisma.exchange.update({
    data: {
      deals: {
        createMany: {
          data: [
            {
              id: "slap_exchange_id_douglas_student_id_deal_id",
              participant_id: douglas_student_id,
              status: "APPROVED",
            },
            {
              id: "slap_exchange_id_johan_student_id_deal_id",
              participant_id: johan_student_id,
              status: "APPROVED",
            },
          ],
        },
      },
    },
    where: { id: exchange_id },
  });
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.exchange.deleteMany({});
  await prisma.user.deleteMany({});
});
