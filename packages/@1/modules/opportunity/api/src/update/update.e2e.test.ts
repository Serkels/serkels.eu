//

import {
  create_concert_20240915,
  create_film_category,
  create_masterclass_category,
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
import api_router from "./update";

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

  const response = await trpc.update({
    category_id: "film_category_id",
    cover: "https://example.com/cover.png",
    description: "Film du concert description",
    title: "Vulfpeck : Le concert",
    expiry_date: "2011-12-11",
    link: "https://example.com/film/concert",
    location: "Film concert location",
    id: "concert_20240915",
  });

  expect(response).toMatchInlineSnapshot(
    {
      id: "concert_20240915",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    },
    `
    {
      "category_id": "film_category_id",
      "cover": "https://example.com/cover.png",
      "created_at": Any<Date>,
      "description": "Film du concert description",
      "expiry_date": 2011-12-11T00:00:00.000Z,
      "id": "concert_20240915",
      "link": "https://example.com/film/concert",
      "location": "Film concert location",
      "owner_id": "vulfpeck_partner_id",
      "slug": "whale-rock-festival-2024",
      "title": "Vulfpeck : Le concert",
      "updated_at": Any<Date>,
    }
  `,
  );
});

//

beforeEach(async function seed() {
  await create_film_category(prisma);
  await create_masterclass_category(prisma);
  const vulfpeck_partner_id = await create_vulfpeck_partner(prisma);
  await create_concert_20240915(prisma, vulfpeck_partner_id);
});

afterEach(async function empty_delete_entries() {
  await prisma.profile.deleteMany({});
  await prisma.category.deleteMany({});
});
