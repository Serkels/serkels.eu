//

import {
  create_douglas_student,
  create_joedart_student,
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
  expect,
  setSystemTime,
  test,
} from "bun:test";
import { find } from "./find";

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

//

test("return my latest exchanges", async () => {
  const caller = createCallerFactory(router({ find }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const exchange = await trpc.find({});
  expect(exchange).toMatchSnapshot();
});

test("should not return archived exchanges", async () => {
  await prisma.exchangeThread.update({
    data: { is_archived: true },
    where: { id: "slap_exchange_id_douglas_student_id_exchange_thread_id" },
  });
  const caller = createCallerFactory(router({ find }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const exchange = await trpc.find({});
  expect(exchange).toMatchSnapshot();
});

//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  const douglas_student_id = await create_douglas_student(prisma);
  const joedart_student_id = await create_joedart_student(prisma);
  const { id: slap_exchange_id } = await create_slap_exchange(
    prisma,
    joedart_student_id,
  );

  await prisma.exchangeThread.create({
    data: {
      id: "slap_exchange_id_douglas_student_id_exchange_thread_id",
      deal: {
        create: {
          id: "slap_exchange_id_douglas_student_id_deal_id",
          parent: { connect: { id: slap_exchange_id } },
          participant: { connect: { id: douglas_student_id } },
        },
      },
      owner: { connect: { id: douglas_student_id } },
      thread: {
        create: {
          id: "slap_exchange_id_douglas_student_id_thread_id",
          updated_at: new Date(),
        },
      },
    },
  });
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.exchange.deleteMany({});
  await prisma.exchangeThread.deleteMany({});
  await prisma.thread.deleteMany({});
  await prisma.user.deleteMany({});
});
