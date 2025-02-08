//

import {
  create_film_category,
  create_vulfpeck_partner,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import {
  NEXTAUTH_SECRET,
  vulfpeck_golden_nextauth_header,
} from "@1.modules/trpc/testing";
import {
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import api_router from "./create";

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

const nextauth_header = vulfpeck_golden_nextauth_header;

//

test("return my latest followers", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);

  const response = await trpc.create({
    category_id: "film_category_id",
    cover: "https://example.com/cover.png",
    description: "Film description",
    title: "Vulfpeck : Le film",
    expiry_date: "2011-12-11",
    link: "https://example.com/film",
    location: "Film location",
  });

  expect(response).toMatchInlineSnapshot(
    {
      id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    },
    `
    {
      "category_id": "film_category_id",
      "cover": "https://example.com/cover.png",
      "created_at": Any<Date>,
      "description": "Film description",
      "expiry_date": 2011-12-11T00:00:00.000Z,
      "id": Any<String>,
      "link": "https://example.com/film",
      "location": "Film location",
      "owner_id": "vulfpeck_partner_id",
      "slug": "vulfpeck-le-film",
      "title": "Vulfpeck : Le film",
      "updated_at": Any<Date>,
    }
  `,
  );
});

//

beforeEach(async function seed() {
  await create_film_category(prisma);
  await create_vulfpeck_partner(prisma);
});

afterEach(async function empty_delete_entries() {
  await prisma.profile.deleteMany({});
  await prisma.category.deleteMany({});
});
