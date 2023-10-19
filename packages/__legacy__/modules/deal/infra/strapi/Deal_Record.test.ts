//

/// <reference types="bun-types" />

import type { components } from "@1/strapi-openapi/v1";
import { expect, test } from "bun:test";
import * as fc from "fast-check";
import assert from "node:assert";
import { ZodFastCheck } from "zod-fast-check";
import { Deal } from "../../domain";
import { Deal_Record } from "./Deal_Record";
import fixture from "./exhange_id_deals.json";

//

const mock = fixture as components["schemas"]["ExchangeDealListResponse"];

//

test("Item", () => {
  //
  const item = Deal_Record.parse(
    { data: mock.data?.at(0) },
    { path: ["item"] },
  );
  assert.ok(item);

  //

  expect(item).toBeInstanceOf(Deal);

  expect(item.id.value()).toBe("35");

  expect(item.toObject()).toMatchSnapshot();
});

//

test("List", () => {
  //
  const mock_data = mock.data;
  assert.ok(mock_data);

  //
  const list = mock_data.map((data, index) =>
    Deal_Record.parse({ data }, { path: [`mock.data[${index}]`] }),
  );

  //
  expect(list).toBeArray();
  expect(list.at(0)).toBeInstanceOf(Deal);
  expect(list.at(0)!.toObject()).toMatchSnapshot(
    {},
    "Cours d'Anglais niveau avancé",
  );
});

//

test.skip("Property Based", () =>
  fc.assert(
    fc.property(
      ZodFastCheck()
        // .override(Exchange_PropsSchema._input.category, fc.nat() as any)
        .inputOf(Deal_Record)
        .filter(({ data }) => Boolean(data)),
      (data) => {
        const entity = Deal_Record.parse(data, { path: ["data"] });

        expect(entity).toBeInstanceOf(Deal);
      },
    ),
    { endOnFailure: true },
  ));
