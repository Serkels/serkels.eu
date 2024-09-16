//

import {
  create_douglas_student,
  create_joedart_student,
  create_johan_student,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { create_nextauth_header, createCallerFactory } from "@1.modules/trpc";
import {
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import follower_router from "./index";

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

test("return my latest followers", async () => {
  const caller = createCallerFactory(follower_router);
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const response = await trpc.find({});
  expect(response).toMatchSnapshot();
});

test("return a valid cursor", async () => {
  const caller = createCallerFactory(follower_router);
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

//

beforeEach(async function seed() {
  await create_douglas_student(prisma);
  await create_joedart_student(prisma);
  await create_johan_student(prisma);

  await prisma.profile.update({
    data: {
      in_contact_with: {
        connect: [{ id: "joedart_profile_id" }, { id: "johan_profile_id" }],
      },
    },
    where: { id: "douglas_profile_id" },
  });
});

afterEach(async function empty_delete_entries() {
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
});
