//

/// <reference types="bun-types" />

import "reflect-metadata";

import { expect, test } from "bun:test";
import { container } from "tsyringe";
import { fromServer } from "~/app/api/v1";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { Deal_Repository } from "./Deal.repository";
import { Exchange_Repository } from "./Exchange_Repository";

test("Deal_Repository scoped injection", () => {
  const root = container.createChildContainer();
  root.registerInstance(API_TOKEN, fromServer);
  root.registerInstance(JWT_TOKEN, "JWT_TOKEN");
  root.registerInstance(Exchange_Repository.EXCHANGE_ID_TOKEN, 123);
  const repo1 = root.resolve(Deal_Repository);

  const scope = root.createChildContainer();
  scope.registerInstance(Exchange_Repository.EXCHANGE_ID_TOKEN, 321);
  const repo2 = scope.resolve(Deal_Repository);
  const repo3 = scope.resolve(Deal_Repository);

  expect(repo1.exchange_id).toBe(123);
  expect(repo2.exchange_id).toBe(321);

  expect(repo1 === repo2).toBeFalse();
  expect(repo2 === repo3).toBeTruthy();
});
