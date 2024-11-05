//

import { create_film_category } from "@1.infra/database/seeding";
import prisma, { empty_database, migrate } from "@1.infra/database/testing";
import { type Session } from "@1.modules/auth.next";
import type { NewStudent_Schema } from "@1.modules/profile.domain";
import { createCallerFactory } from "@1.modules/trpc";
import { beforeAll, expect, test } from "bun:test";
import type { z } from "zod";
import signup_router, { type Input } from "./signup";

//

beforeAll(empty_database);
beforeAll(migrate);

//

const auth = () =>
  ({
    user: { email: "douglas@example.com" },
  }) as Session;
const default_input: Input = {
  name: "Douglas",
  role: "STUDENT",
  bio: "Je suis un étudiant passionné par la programmation",
  context: {
    university: "Paris 1",
    field_of_study: "Informatique",
    city: "Paris",
    language: "Français",
    interest_id: "film_category_id",
  } as z.infer<typeof NewStudent_Schema>,
};

test("return a new profile", async () => {
  await create_film_category(prisma);
  await prisma.user.create({ data: { email: "douglas@example.com" } });
  const caller = createCallerFactory(signup_router);
  const trpc = caller({ prisma, auth } as any);
  const response = await trpc.signup(default_input);
  expect(response).toEqual({
    id: expect.any(String),
  });
});

test("fail with no session", async () => {
  const caller = createCallerFactory(signup_router);
  const trpc = caller({ prisma, auth: () => null } as any);
  await expect(trpc.signup(default_input)).rejects.toThrowError(
    "User session not found",
  );
});

test("fail with no user email", async () => {
  const caller = createCallerFactory(signup_router);
  const trpc = caller({ prisma, auth: () => ({}) } as any);
  await expect(trpc.signup(default_input)).rejects.toThrowError(
    "User session not found",
  );
});
