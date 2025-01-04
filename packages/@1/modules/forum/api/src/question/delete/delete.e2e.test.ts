//

import {
  create_douglas_student,
  create_film_category,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory, type Session } from "@1.modules/trpc";
import { afterAll, beforeAll, expect, setSystemTime, test } from "bun:test";
import delete_quetion from "./delete";

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

const auth = () =>
  ({
    profile: { id: "douglas_profile_id" },
  }) as Session;

test("delete a question", async () => {
  const caller = createCallerFactory(delete_quetion);
  const trpc = caller({
    auth,
    prisma,
  } as any);
  const response = await trpc.delete("best-film-2011");
  expect(response).toMatchSnapshot();
});

//

beforeAll(async function seed() {
  const cinema_category_id = await create_film_category(prisma);
  const douglas_student_id = await create_douglas_student(prisma);

  await prisma.question.createMany({
    data: [
      {
        id: "best-film-2011",
        category_id: cinema_category_id,
        created_at: new Date("2011-11-11"),
        owner_id: douglas_student_id,
        title: "What is the best film of 2011 ?",
        updated_at: new Date("2011-11-11"),
      },
    ],
  });
});

afterAll(async function empty_delete_entries() {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
});
