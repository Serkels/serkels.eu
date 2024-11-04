//

import { create_douglas_student } from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import {
  douglas_golden_nextauth_header,
  NEXTAUTH_SECRET,
} from "@1.modules/trpc/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import verify_router from "./index";

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

test("return found user id", async () => {
  await create_douglas_student(prisma);
  const caller = createCallerFactory(verify_router);
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const response = await trpc.verify({ email: "douglas@example.com" });
  expect(response).toMatchSnapshot();
});

test("return null when user not found", async () => {
  const caller = createCallerFactory(verify_router);
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma,
  } as any);
  const response = await trpc.verify({ email: "douglas@serkels.com" });
  expect(response).toMatchSnapshot();
});
