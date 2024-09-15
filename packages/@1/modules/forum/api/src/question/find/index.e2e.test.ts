//

import {
  create_douglas_student,
  create_film_category,
  create_johan_student,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import {
  create_nextauth_header,
  createCallerFactory,
  router,
} from "@1.modules/trpc";
import { beforeAll, describe, expect, setSystemTime, test } from "bun:test";
import find_quetions from "./index";

//

const NEXTAUTH_SECRET = "🔑";

beforeAll(() => {
  process.env["NEXTAUTH_SECRET"] = NEXTAUTH_SECRET;
});

beforeAll(empty_database);
beforeAll(migrate);
beforeAll(() => {
  setSystemTime(new Date("2011-11-11"));
});

//

describe("visitor", () => {
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
});

describe("connected studient", () => {
  let nextauth_header: Awaited<ReturnType<typeof create_nextauth_header>>;
  beforeAll(async () => {
    nextauth_header = await create_nextauth_header({
      secret: "🔑",
      token: {
        from: import.meta.url,
        profile: { id: "johan_profile_id", role: "STUDENT" },
      },
    });
  });

  test("find all latest questions", async () => {
    const caller = createCallerFactory(
      router({
        find: find_quetions,
      }),
    );
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const questions = await trpc.find({});
    expect(questions).toMatchSnapshot();
  });

  test("list my questions", async () => {
    const caller = createCallerFactory(
      router({
        find: find_quetions,
      }),
    );
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const questions = await trpc.find({
      filter: "MINE",
    });
    expect(questions).toMatchSnapshot();
  });

  test("should not list questions created by profile I blocked", async () => {
    await prisma.profile.update({
      data: { blacklist: { create: { profile_id: "douglas_profile_id" } } },
      where: { id: "johan_profile_id" },
    });
    const caller = createCallerFactory(
      router({
        find: find_quetions,
      }),
    );
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const questions = await trpc.find({});
    expect(questions).toMatchSnapshot();
  });

  test("should not list questions created by profiles who blocked me", async () => {
    await prisma.profile.update({
      data: { blacklisted_by: { create: { owner_id: "douglas_profile_id" } } },
      where: { id: "johan_profile_id" },
    });
    const caller = createCallerFactory(
      router({
        find: find_quetions,
      }),
    );
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const questions = await trpc.find({});
    expect(questions).toMatchSnapshot();
  });
});

//

beforeAll(async function seed() {
  const cinema_category_id = await create_film_category(prisma);
  const douglas_studient_id = await create_douglas_student(prisma);

  const johan_studient_id = await create_johan_student(prisma);

  //

  return prisma.question.createMany({
    data: [
      {
        id: "best-film-2011",
        category_id: cinema_category_id,
        created_at: new Date("2011-11-11"),
        owner_id: douglas_studient_id,
        title: "What is the best film of 2011 ?",
        updated_at: new Date("2011-11-11"),
      },
      {
        id: "popular-film-2011",
        category_id: cinema_category_id,
        created_at: new Date("2011-11-10"),
        owner_id: douglas_studient_id,
        title: "What is the most popular film of 2011 ?",
        updated_at: new Date("2011-11-10"),
      },
      {
        id: "best-actor-2011",
        category_id: cinema_category_id,
        created_at: new Date("2011-11-10"),
        owner_id: johan_studient_id,
        title: "How is the best actor of 2011 ?",
        updated_at: new Date("2011-11-10"),
      },
    ],
  });
});
