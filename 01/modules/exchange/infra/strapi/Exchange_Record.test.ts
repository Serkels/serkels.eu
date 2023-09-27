//

/// <reference types="bun-types" />

import type { components } from "@1/strapi-openapi/v1";
import { expect, test } from "bun:test";
import * as fc from "fast-check";
import assert from "node:assert";
import { ZodFastCheck } from "zod-fast-check";
import { Category } from "../../../category/domain";
import { Profile } from "../../../profile/domain";
import { Exchange } from "../../domain";
import { Exchange_Record } from "./Exchange_Record";
import fixture from "./exchanges.json";

//

const mock = fixture as components["schemas"]["ExchangeListResponse"];

//

test.only("Item", () => {
  //
  const item = Exchange_Record.parse(
    { data: mock.data?.at(0) },
    { path: ["item"] },
  );
  assert.ok(item);

  //

  expect(item).toBeInstanceOf(Exchange);

  expect(item.id.value()).toBe("4");
  expect(item.get("category")).toBeInstanceOf(Category);
  expect(item.get("profile")).toBeInstanceOf(Profile);

  expect(item.toObject()).toMatchSnapshot();
});

//

test("List", () => {
  //
  const mock_data = mock.data;
  assert.ok(mock_data);

  //
  const list = mock_data.map((data, index) =>
    Exchange_Record.parse({ data }, { path: [`mock.data[${index}]`] }),
  );

  //
  expect(list).toBeArray();
  expect(list.at(0)).toBeInstanceOf(Exchange);
  expect(list.at(0)!.toObject()).toMatchSnapshot(
    {},
    "Cours d'Anglais niveau avancé",
  );

  expect(list.at(1)).toBeInstanceOf(Exchange);
  expect(list.at(1)!.toObject()).toMatchSnapshot(
    {},
    "Visite expo Picasso en couleurs",
  );
});

//

test.skip("Property Based", () =>
  fc.assert(
    fc.property(
      ZodFastCheck()
        // .override(Exchange_PropsSchema._input.category, fc.nat() as any)
        .inputOf(Exchange_Record)
        .filter(({ data }) => Boolean(data)),
      (data) => {
        const entity = Exchange_Record.parse(data, { path: ["data"] });

        expect(entity).toBeInstanceOf(Exchange);
      },
    ),
    { endOnFailure: true },
  ));
