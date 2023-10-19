//

/// <reference types="bun-types" />

import type { components } from "@1/strapi-openapi/v1";
import { expect, test } from "bun:test";
import * as fc from "fast-check";
import assert from "node:assert";
import { ZodFastCheck } from "zod-fast-check";
import { Category } from "../../domain";
import { Category_Record } from "./Category_Record";
import fixture from "./category;exhange.json";

//

const mock = fixture as components["schemas"]["CategoryExchangeResponse"];

//

test("Item", () => {
  //
  const categories = mock.data?.attributes?.categories?.data;
  assert.ok(categories);

  //
  const item = Category_Record.parse(
    { data: categories.at(0) },
    { path: ["mock.data?.attributes?.categories?.data[0]"] },
  );
  assert.ok(item);

  //

  expect(item).toBeInstanceOf(Category);

  expect(item.toObject()).toMatchSnapshot();
});

//

test("List", () => {
  //
  const categories = mock.data?.attributes?.categories?.data;
  assert.ok(categories);

  //
  const list = categories.map((data) => Category_Record.parse({ data }));

  //
  expect(list).toBeArray();
  expect(list.at(0)).toBeInstanceOf(Category);
  expect(list.at(0)!.toObject()).toMatchSnapshot({}, "Autres");
  expect(list.at(1)).toBeInstanceOf(Category);
  expect(list.at(1)!.toObject()).toMatchSnapshot({}, "Activités");
});

//

test("Property Based", () =>
  fc.assert(
    fc.property(
      ZodFastCheck()
        .inputOf(Category_Record)
        .filter(({ data }) => Boolean(data)),
      (data) => {
        const category = Category_Record.parse(data, { path: ["data"] });

        expect(category).toBeInstanceOf(Category);
      },
    ),
    { endOnFailure: true },
  ));
