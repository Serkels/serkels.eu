//

import {
  create_douglas_student,
  create_greatings_message,
  create_joedart_student,
} from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { createCallerFactory } from "@1.modules/trpc";
import { douglas_student_session } from "@1.modules/trpc/testing";
import { afterEach, beforeAll, beforeEach, expect, test } from "bun:test";
import api_router from "./count_unread";

//

beforeAll(empty_database);
beforeAll(migrate);

//

test("return count of all unread notifications", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const data = await trpc.count_unread({});
  expect(data).toMatchSnapshot();
});

test("return count of exchange notifications", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const data = await trpc.count_unread({ type: "EXCHANGE" });
  expect(data).toMatchSnapshot();
});

test("return count of inbox notifications", async () => {
  const caller = createCallerFactory(api_router);
  const trpc = caller({
    auth: () => douglas_student_session,
    prisma,
  } as any);
  const data = await trpc.count_unread({ type: "INBOX" });
  expect(data).toMatchSnapshot();
});

//

beforeEach(async function seed() {
  await create_douglas_student(prisma);
  await create_joedart_student(prisma);
  await create_greatings_message(
    prisma,
    "douglas_profile_id",
    "joedart_profile_id",
  );

  const { id: message_id } = await prisma.message.create({
    data: {
      thread: { create: {} },
      author: { connect: { id: "douglas_profile_id" } },
      content: "World",
      created_at: new Date(),
      updated_at: new Date(),
    },
    select: { id: true },
  });

  await prisma.exchangeMessageNotification.create({
    data: {
      message: { connect: { id: message_id } },
      notification: {
        create: {
          owner_id: "douglas_profile_id",
          read_at: null,
          type: "EXCHANGE_COMPLETED",
        },
      },
    },
  });

  await prisma.exchangeMessageNotification.create({
    data: {
      message: { connect: { id: message_id } },
      notification: {
        create: {
          owner_id: "douglas_profile_id",
          read_at: null,
          type: "EXCHANGE_NEW_MESSAGE",
        },
      },
    },
  });

  await prisma.exchangeMessageNotification.create({
    data: {
      message: { connect: { id: message_id } },
      notification: {
        create: {
          owner_id: "douglas_profile_id",
          read_at: null,
          type: "EXCHANGE_NEW_PARTICIPANT",
        },
      },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        owner_id: "douglas_profile_id",
        read_at: null,
        type: "FORUM_NEW_AWNSER",
      },
      {
        owner_id: "douglas_profile_id",
        read_at: null,
        type: "PROFILE_ADDED",
      },
    ],
  });
});

afterEach(async function empty_delete_entries() {
  await prisma.thread.deleteMany();
  await prisma.user.deleteMany();
});
