//

import {
  create_concert_20240915,
  create_douglas_student,
  create_masterclass_category,
  create_vulfpeck_partner,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import {
  create_nextauth_header,
  createCallerFactory,
  router,
} from "@1.modules/trpc";
import {
  douglas_golden_nextauth_header,
  NEXTAUTH_SECRET,
  vulfpeck_golden_nextauth_header,
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
import find from "./index";

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
  test("should return latest opportunities", async () => {
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({ prisma } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "category": {
              "id": "masterclass_category_id",
              "name": "Masterclass",
              "slug": "masterclass",
            },
            "cover": "https://picsum.photos/600/400",
            "created_at": 2011-11-11T00:00:00.000Z,
            "description": "https://vulf.co/courses/dart/lectures/45940163",
            "expiry_date": 2024-09-15T00:00:00.000Z,
            "id": "concert_20240915",
            "location": "Castoro Cellars Vineyards & Winery",
            "owner": {
              "profile": {
                "id": "vulfpeck_profile_id",
                "image": "https://picsum.photos/300/300",
                "name": "Vulfpeck",
              },
            },
            "slug": "whale-rock-festival-2024",
            "title": "WHALE ROCK FESTIVAL ",
            "updated_at": 2011-11-11T00:00:00.000Z,
          },
        ],
        "next_cursor": undefined,
      }
    `);
  });

  test("should not list expired opportunities", async () => {
    await prisma.opportunity.update({
      data: { expiry_date: new Date("2011-11-10") },
      where: { id: "concert_20240915" },
    });
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({ prisma } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [],
        "next_cursor": undefined,
      }
    `);
  });
});

describe("connected student", () => {
  let nextauth_header: Awaited<ReturnType<typeof create_nextauth_header>>;

  beforeAll(async () => {
    nextauth_header = douglas_golden_nextauth_header;
  });

  test("should return latest opportunities", async () => {
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "category": {
              "id": "masterclass_category_id",
              "name": "Masterclass",
              "slug": "masterclass",
            },
            "cover": "https://picsum.photos/600/400",
            "created_at": 2011-11-11T00:00:00.000Z,
            "description": "https://vulf.co/courses/dart/lectures/45940163",
            "expiry_date": 2024-09-15T00:00:00.000Z,
            "id": "concert_20240915",
            "location": "Castoro Cellars Vineyards & Winery",
            "owner": {
              "profile": {
                "id": "vulfpeck_profile_id",
                "image": "https://picsum.photos/300/300",
                "name": "Vulfpeck",
              },
            },
            "slug": "whale-rock-festival-2024",
            "title": "WHALE ROCK FESTIVAL ",
            "updated_at": 2011-11-11T00:00:00.000Z,
          },
        ],
        "next_cursor": undefined,
      }
    `);
  });

  test("should not list opportunities created by profile I blocked", async () => {
    await prisma.profile.update({
      data: { blacklist: { create: { profile_id: "vulfpeck_profile_id" } } },
      where: { id: "douglas_profile_id" },
    });
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [],
        "next_cursor": undefined,
      }
    `);
  });

  test("should not list opportunities created by profiles who blocked me", async () => {
    await prisma.profile.update({
      data: { blacklisted_by: { create: { owner_id: "vulfpeck_profile_id" } } },
      where: { id: "douglas_profile_id" },
    });
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [],
        "next_cursor": undefined,
      }
    `);
  });
});

describe("connected partner", () => {
  let nextauth_header: Awaited<ReturnType<typeof create_nextauth_header>>;

  beforeAll(async () => {
    nextauth_header = vulfpeck_golden_nextauth_header;
  });

  test("should return latest opportunities", async () => {
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.find({});
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "category": {
              "id": "masterclass_category_id",
              "name": "Masterclass",
              "slug": "masterclass",
            },
            "cover": "https://picsum.photos/600/400",
            "created_at": 2011-11-11T00:00:00.000Z,
            "description": "https://vulf.co/courses/dart/lectures/45940163",
            "expiry_date": 2024-09-15T00:00:00.000Z,
            "id": "concert_20240915",
            "location": "Castoro Cellars Vineyards & Winery",
            "owner": {
              "profile": {
                "id": "vulfpeck_profile_id",
                "image": "https://picsum.photos/300/300",
                "name": "Vulfpeck",
              },
            },
            "slug": "whale-rock-festival-2024",
            "title": "WHALE ROCK FESTIVAL ",
            "updated_at": 2011-11-11T00:00:00.000Z,
          },
        ],
        "next_cursor": undefined,
      }
    `);
  });

  test("should return my latest opportunities", async () => {
    const caller = createCallerFactory(router({ find }));
    const trpc = caller({
      headers: { ...nextauth_header },
      prisma,
    } as any);
    const exchange = await trpc.find({
      filter: "MY_OPPORTUNITIES",
    });
    expect(exchange).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "category": {
              "id": "masterclass_category_id",
              "name": "Masterclass",
              "slug": "masterclass",
            },
            "cover": "https://picsum.photos/600/400",
            "created_at": 2011-11-11T00:00:00.000Z,
            "description": "https://vulf.co/courses/dart/lectures/45940163",
            "expiry_date": 2024-09-15T00:00:00.000Z,
            "id": "concert_20240915",
            "location": "Castoro Cellars Vineyards & Winery",
            "owner": {
              "profile": {
                "id": "vulfpeck_profile_id",
                "image": "https://picsum.photos/300/300",
                "name": "Vulfpeck",
              },
            },
            "slug": "whale-rock-festival-2024",
            "title": "WHALE ROCK FESTIVAL ",
            "updated_at": 2011-11-11T00:00:00.000Z,
          },
        ],
        "next_cursor": undefined,
      }
    `);
  });
});
//

beforeEach(async function seed() {
  await create_masterclass_category(prisma);
  await create_douglas_student(prisma);
  const vulfpeck_partner = await create_vulfpeck_partner(prisma);
  await create_concert_20240915(prisma, vulfpeck_partner);
});

afterEach(async function empty_delete_entries() {
  await prisma.category.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.user.deleteMany({});
});
