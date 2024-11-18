//

import {
  create_douglas_student,
  create_film_category,
  create_joedart_student,
  create_masterclass_category,
  create_slap_exchange,
  create_the_creator_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory, router } from "@1.modules/trpc";
import {
  douglas_golden_nextauth_header,
  NEXTAUTH_SECRET,
} from "@1.modules/trpc/testing";
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

const nextauth_header = douglas_golden_nextauth_header;

//

test("return my latest exchanges", async () => {
  const caller = createCallerFactory(router({ find }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const response = await trpc.find({});
  expect(response).toMatchSnapshot();
});

test("return a valid cursor", async () => {
  const caller = createCallerFactory(router({ find }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const first_response = await trpc.find({ limit: 1 });
  expect(first_response).toMatchSnapshot("first_response");

  const second_response = await trpc.find({
    limit: 1,
    cursor: first_response.next_cursor,
  });
  expect(second_response).toMatchSnapshot("second_response");
});

test("should not return archived exchanges", async () => {
  await prisma.exchangeThread.updateMany({
    data: { is_archived: true },
    where: {
      id: {
        in: [
          "slap_exchange_id_douglas_student_id_exchange_thread_id",
          "the_creator_exchange_id_douglas_student_id_exchange_thread_id",
        ],
      },
    },
  });
  const caller = createCallerFactory(router({ find }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const response = await trpc.find({});
  expect(response).toMatchSnapshot();
});

//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  await create_film_category(prisma);
  const douglas_student_id = await create_douglas_student(prisma);
  const joedart_student_id = await create_joedart_student(prisma);
  const { id: slap_exchange_id } = await create_slap_exchange(
    prisma,
    joedart_student_id,
  );
  const { id: the_creator_exchange_id } = await create_the_creator_exchange(
    prisma,
    douglas_student_id,
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
          updated_at: new Date("2011-11-11"),
        },
      },
    },
  });
  await prisma.exchangeThread.create({
    data: {
      id: "the_creator_exchange_id_douglas_student_id_exchange_thread_id",
      deal: {
        create: {
          id: "the_creator_exchange_id_douglas_student_id_deal_id",
          parent: { connect: { id: the_creator_exchange_id } },
          participant: { connect: { id: douglas_student_id } },
        },
      },
      owner: { connect: { id: douglas_student_id } },
      thread: {
        create: {
          id: "the_creator_exchange_id_douglas_student_id_thread_id",
          updated_at: new Date("2011-11-10"),
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
