//

import {
  create_nextauth_header,
  createCallerFactory,
  router,
} from "@1.modules/trpc";
import { beforeAll, expect, test } from "bun:test";
import exchange_by_id from "./by_id";

//

const NEXTAUTH_SECRET = "🔑";

beforeAll(() => {
  process.env["NEXTAUTH_SECRET"] = NEXTAUTH_SECRET;
});

//

test("should return a sanitize exchange", async () => {
  const nextauth_header = await create_nextauth_header({
    secret: "🔑",
    token: {
      from: "by_id.e2e.test.te",
      profile: { id: "douglas", role: "STUDENT" },
    },
  });
  const caller = createCallerFactory(router({ by_id: exchange_by_id }));
  const trpc = caller({
    headers: { ...nextauth_header },
    prisma: {
      exchange: {
        findUniqueOrThrow: () => ({
          deals: [
            { participant: { profile: { id: "douglas" } } },
            { participant: { profile: { id: "johan" } } },
          ],
        }),
      },
    },
  } as any);
  const exchange = await trpc.by_id("vulfpeck-joe-dart-masterclass");
  expect(exchange).toMatchObject({
    deals: [
      {
        participant: { profile: { id: "douglas" } },
      },
      { participant: undefined },
    ],
  });
});
