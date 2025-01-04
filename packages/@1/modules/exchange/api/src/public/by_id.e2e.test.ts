//

import {
  create_douglas_student,
  create_joedart_student,
  create_johan_student,
  create_masterclass_category,
  create_slap_exchange,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import { douglas_student_session } from "@1.modules/trpc/testing";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import by_id_api_router from "./by_id";

//

beforeAll(empty_database);
beforeAll(migrate);

//

describe("visitor", () => {
  test("should return a sanitize exchange", async () => {
    const caller = createCallerFactory(by_id_api_router);
    const trpc = caller({
      auth: () => null,
      prisma,
    } as any);
    const response = await trpc.by_id("slap_exchange_id");
    expect(response).toMatchSnapshot();
  });
});

describe("connected studient", () => {
  test("should return a sanitize exchange", async () => {
    const caller = createCallerFactory(by_id_api_router);
    const trpc = caller({
      auth: () => douglas_student_session,
      prisma,
    } as any);
    const response = await trpc.by_id("slap_exchange_id");
    expect(response).toMatchSnapshot();
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
