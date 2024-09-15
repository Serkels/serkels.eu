//

import {
  create_douglas_student,
  create_johan_student,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory, router } from "@1.modules/trpc";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import find_quetions from "./index";

//

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

test("find all latest questions", async () => {
  const caller = createCallerFactory(
    router({
      find: find_quetions,
    }),
  );
  const trpc = caller({
    prisma,
  } as any);
  const questions = await trpc.find({});
  expect(questions).toMatchSnapshot();
});

test("search for douglas' questions", async () => {
  const caller = createCallerFactory(
    router({
      find: find_quetions,
    }),
  );
  const trpc = caller({
    prisma,
  } as any);
  const questions = await trpc.find({
    search: "douglas",
  });
  expect(questions).toMatchSnapshot();
});

test("search for 'best actor' questions", async () => {
  const caller = createCallerFactory(
    router({
      find: find_quetions,
    }),
  );
  const trpc = caller({
    prisma,
  } as any);
  const questions = await trpc.find({
    search: "meilleur acteur",
  });
  expect(questions).toMatchSnapshot();
});
//

beforeAll(async function seed() {
  const cinema_category = await prisma.category.create({
    data: { id: "cinema-category", name: "Cinéma", slug: "cinema" },
    select: { id: true },
  });
  const douglas_studient_id = await create_douglas_student(prisma);

  const johan_studient_id = await create_johan_student(prisma);

  //

  return prisma.question.createMany({
    data: [
      {
        id: "best-film-2011",
        category_id: cinema_category.id,
        created_at: new Date("2011-11-11"),
        owner_id: douglas_studient_id,
        title: "Quel est le meilleur film de 2011 ?",
        updated_at: new Date("2011-11-11"),
      },
      {
        id: "popular-film-2011",
        category_id: cinema_category.id,
        created_at: new Date("2011-11-10"),
        owner_id: douglas_studient_id,
        title: "Quel est le film le plus populaire de 2011 ?",
        updated_at: new Date("2011-11-10"),
      },
      {
        id: "best-actor-2011",
        category_id: cinema_category.id,
        created_at: new Date("2011-11-10"),
        owner_id: johan_studient_id,
        title: "Qui est le meilleur acteur de 2011 ?",
        updated_at: new Date("2011-11-10"),
      },
    ],
  });
});
